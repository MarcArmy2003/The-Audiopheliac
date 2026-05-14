"""Audiopheliac Cockpit launcher — packaged-app entry point.

The desktop shortcut at
    C:\\Users\\gillo\\OneDrive\\Desktop\\Audiopheliac Cockpit.lnk
points pythonw.exe at this file. Clicking the icon should "just work":

  1. If the Cockpit is already running, open a new Chrome --app window
     pointed at the existing process and exit. No second Flask, no
     port conflict.
  2. Pre-start Roon Bridge (user-mode tray app) on GDMARCHE if its
     RAATServer process isn't already running. Tries the standard
     Roon install paths.
  3. Pre-start the Roon Server container on the QNAP if an SSH key is
     configured at config.roon_server.ssh_key_path. Otherwise skip
     silently and let the Cockpit's in-UI bootstrap surface fall back to
     reachability detection.
  4. Start Flask in a daemon thread.
  5. Warm-fire /api/system/bootstrap so the topbar paints with live
     state on the first browser frame.
  6. Open Chrome (or Edge) in --app mode at http://127.0.0.1:5000/.

All subprocesses use CREATE_NO_WINDOW so no console windows flash. The
file extension is .pyw so Windows launches it under pythonw.exe with no
parent console of its own.
"""
from __future__ import annotations

import json
import os
import re
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path


HERE = Path(__file__).resolve().parent
_NO_WINDOW = 0x08000000  # subprocess.CREATE_NO_WINDOW on Windows

# Match app.py's _CONTAINER_NAME_RE. Defense against SSH remote-shell
# injection via config.json container_name. Codex/Rafa Phase 1 review
# 2026-05-13 HIGH finding.
_CONTAINER_NAME_RE = re.compile(r"^[a-zA-Z0-9_.-]{1,64}$")


# ----------------------------------------------------------------------
# Config + small utilities
# ----------------------------------------------------------------------

def load_config() -> dict:
    cfg_path = HERE / "config.json"
    cfg: dict = {"host": "127.0.0.1", "port": 5000}
    if cfg_path.exists():
        with cfg_path.open("r", encoding="utf-8") as f:
            cfg.update(json.load(f))
    return cfg


def wait_for_port(host: str, port: int, timeout: float = 15.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.2)
    return False


def _process_running(name: str) -> bool:
    """True if a Windows process by image name is running. No console flash."""
    exe = name if name.lower().endswith(".exe") else f"{name}.exe"
    try:
        r = subprocess.run(
            ["tasklist", "/FI", f"IMAGENAME eq {exe}", "/FO", "CSV", "/NH"],
            capture_output=True, text=True, timeout=5,
            creationflags=_NO_WINDOW,
        )
    except (subprocess.SubprocessError, OSError):
        return False
    out = (r.stdout or "").strip()
    if not out or out.lower().startswith("info:"):
        return False
    return exe.lower() in out.lower()


# ----------------------------------------------------------------------
# Singleton
# ----------------------------------------------------------------------

def is_existing_cockpit(host: str, port: int) -> bool:
    """True if a Cockpit instance is already serving on this port.

    Two-step: socket connect (cheap) then verify the response shape from
    /api/config so we don't mistake a foreign process holding the port
    for our Cockpit.

    Rafa Phase 3 HALT 2026-05-13: previous substring check looked for
    '"ok": true' with a space. Flask's default json.dumps emits no space
    after the colon, and JSON_SORT_KEYS reorders the body so "ok" lands
    deep in the payload. Net effect: singleton always returned False,
    every shortcut click spawned a second Flask (Windows SO_REUSEADDR
    masks the bind collision). Parse the JSON instead. `preferred_zones`
    is a Cockpit-specific top-level field and a sufficient anchor.
    """
    try:
        with socket.create_connection((host, port), timeout=0.5):
            pass
    except OSError:
        return False
    try:
        with urllib.request.urlopen(
            f"http://{host}:{port}/api/config", timeout=2
        ) as r:
            data = json.loads(r.read().decode("utf-8", errors="ignore"))
    except Exception:
        return False
    return isinstance(data, dict) and "preferred_zones" in data


# ----------------------------------------------------------------------
# Pre-flight: Roon Bridge (local) + Roon Server (NAS)
# ----------------------------------------------------------------------

def ensure_roon_bridge_running() -> str:
    """Make sure Roon Bridge's RAATServer is alive on GDMARCHE.

    Bridge can be installed as a Windows service OR as a user-mode tray
    app. If RAATServer is already running (either path) we're done. If
    not, try to launch the Bridge.exe tray launcher from one of the
    standard install paths.

    Returns: 'running', 'started', or 'not_installed'.
    """
    if _process_running("RAATServer"):
        return "running"
    candidates = [
        # Confirmed GDMARCHE path (2026-05-13): RoonBridge installs as RoonBridge.exe,
        # not Bridge.exe. Supervisor binary at %LOCALAPPDATA%\RoonBridge\Application\.
        Path(os.environ.get("LOCALAPPDATA", "")) / "RoonBridge" / "Application" / "RoonBridge.exe",
        # Legacy / other install conventions kept as fallback.
        Path(os.environ.get("ProgramFiles", "")) / "Roon" / "Bridge" / "Bridge.exe",
        Path(os.environ.get("ProgramFiles(x86)", "")) / "Roon" / "Bridge" / "Bridge.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Roon" / "Bridge" / "Bridge.exe",
        Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / "Roon Bridge" / "Bridge.exe",
    ]
    for c in candidates:
        try:
            if not c.exists():
                continue
        except OSError:
            continue
        try:
            subprocess.Popen(
                [str(c)],
                cwd=str(c.parent),
                creationflags=_NO_WINDOW,
                close_fds=True,
            )
        except OSError:
            continue
        # Wait up to ~10s for RAATServer to register itself.
        for _ in range(20):
            time.sleep(0.5)
            if _process_running("RAATServer"):
                return "started"
        break
    return "not_installed"


def ensure_roon_server_running(cfg: dict) -> str:
    """If SSH key is configured, ensure the QNAP roonserver container
    is running. Otherwise no-op (Cockpit will fall back to reachability
    detection in the bootstrap endpoint).

    Returns: 'running', 'started', 'no_key', or 'unknown'.
    """
    rs = cfg.get("roon_server") or {}
    ssh_key = rs.get("ssh_key_path") or ""
    if not ssh_key:
        return "no_key"
    try:
        if not Path(ssh_key).exists():
            return "no_key"
    except OSError:
        return "no_key"
    host = rs.get("host") or cfg.get("roon_host") or "192.168.1.230"
    user = rs.get("ssh_user", "admin")
    container = rs.get("container_name", "roonserver")
    # Reject anything that could break out of the docker subcommand into
    # the remote shell. Same regex enforced in app.py. If config has been
    # tampered with, bail before we ssh anywhere.
    if not _CONTAINER_NAME_RE.match(container or ""):
        return "invalid_container_name"

    def _ssh(cmd: str, timeout: float = 6.0) -> tuple[int, str, str]:
        try:
            r = subprocess.run(
                [
                    "ssh", "-i", ssh_key,
                    "-o", "BatchMode=yes",
                    "-o", "StrictHostKeyChecking=accept-new",
                    "-o", "ConnectTimeout=4",
                    f"{user}@{host}",
                    cmd,
                ],
                capture_output=True, text=True, timeout=timeout,
                creationflags=_NO_WINDOW,
            )
            return r.returncode, r.stdout or "", r.stderr or ""
        except (subprocess.SubprocessError, OSError):
            return -1, "", ""

    rc, out, _ = _ssh(
        f"docker inspect {container} --format '{{{{.State.Running}}}}'"
    )
    if rc == 0 and "true" in out.lower():
        return "running"
    rc, _, _ = _ssh(f"docker start {container}", timeout=10.0)
    return "started" if rc == 0 else "unknown"


# ----------------------------------------------------------------------
# Flask + browser
# ----------------------------------------------------------------------

def _write_launcher_error(prefix: str, err: BaseException) -> None:
    """Append a short error record to launch_error.log.

    Under pythonw there is no console; an unhandled exception in the
    launcher or in Flask import/boot is otherwise invisible. This is
    the diagnostic of last resort.
    """
    try:
        line = (
            f"[{time.strftime('%Y-%m-%dT%H:%M:%S')}] {prefix}: "
            f"{type(err).__name__}: {err}\n"
        )
        with (HERE / "launch_error.log").open("a", encoding="utf-8") as f:
            f.write(line)
    except OSError:
        pass


def start_flask(host: str, port: int) -> None:
    """Run Flask on the calling thread. Blocks until the process exits."""
    os.chdir(HERE)
    sys.path.insert(0, str(HERE))
    try:
        from app import app  # imports here so import errors are caught
    except BaseException as e:  # noqa: BLE001
        _write_launcher_error("flask import failed", e)
        raise
    try:
        app.run(host=host, port=port, debug=False, use_reloader=False)
    except BaseException as e:  # noqa: BLE001
        _write_launcher_error("flask runtime failed", e)
        raise


def warm_bootstrap(host: str, port: int) -> None:
    """Hit /api/system/bootstrap once so the topbar pills paint with live
    state on the first browser frame, instead of a 'checking' flash."""
    try:
        with urllib.request.urlopen(
            f"http://{host}:{port}/api/system/bootstrap", timeout=4
        ) as r:
            r.read()
    except Exception:
        pass


def open_app_window(url: str) -> bool:
    """Open Chrome (or Edge) in --app mode. Falls back to default browser."""
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                subprocess.Popen(
                    [
                        path,
                        f"--app={url}",
                        "--window-size=1280,820",
                        "--disable-features=TranslateUI",
                    ],
                    creationflags=_NO_WINDOW,
                    close_fds=True,
                )
            except OSError:
                continue
            return True
    return False


# ----------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------

def _post_boot(host: str, port: int, url: str) -> None:
    """Background work that runs once Flask is up.

    Waits for the port, primes /api/system/bootstrap so the topbar
    paints with live state on first frame, then opens Chrome --app.
    If Flask never comes up (port wait fails) this thread exits quietly.
    """
    try:
        if not wait_for_port(host, port):
            return
        warm_bootstrap(host, port)
        if not open_app_window(url):
            webbrowser.open(url)
    except BaseException as e:  # noqa: BLE001
        _write_launcher_error("post_boot failed", e)


def main() -> None:
    try:
        cfg = load_config()
        host = cfg.get("host", "127.0.0.1")
        port = int(cfg.get("port", 5000))
        url = f"http://{host}:{port}"

        # 1. Pre-flight: kick local Roon Bridge (idempotent if already up).
        #    Done BEFORE the singleton check so that re-clicking the icon
        #    ensures Bridge is running even when the Cockpit is already
        #    serving. Without this ordering, a dropped Bridge connection
        #    is never recovered by clicking the shortcut a second time.
        try:
            ensure_roon_bridge_running()
        except Exception as e:  # noqa: BLE001
            _write_launcher_error("ensure_roon_bridge_running failed", e)

        # 2. Pre-flight: kick NAS Roon Server container if SSH is configured.
        try:
            ensure_roon_server_running(cfg)
        except Exception as e:  # noqa: BLE001
            _write_launcher_error("ensure_roon_server_running failed", e)

        # 3. Singleton: if Cockpit already running, just (re)open the window.
        if is_existing_cockpit(host, port):
            if not open_app_window(url):
                webbrowser.open(url)
            return

        # 4. Schedule post-boot helper (waits for port, warms bootstrap,
        #    opens Chrome). Daemon so it exits with the main thread.
        t = threading.Thread(
            target=_post_boot, args=(host, port, url), daemon=True
        )
        t.start()

        # 5. Run Flask in the main thread. This is where the launcher
        #    process spends its lifetime. If Flask exits, the launcher
        #    exits with it: no zombie thread holding a window open
        #    against a dead port.
        start_flask(host, port)
    except SystemExit:
        raise
    except BaseException as e:  # noqa: BLE001
        _write_launcher_error("launcher main failed", e)
        raise


if __name__ == "__main__":
    main()
