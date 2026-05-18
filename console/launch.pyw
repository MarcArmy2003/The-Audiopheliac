"""Audiopheliac Cockpit launcher — packaged-app entry point.

The desktop shortcut at
    C:\\Users\\gillo\\OneDrive\\Desktop\\Audiopheliac Cockpit.lnk
points pythonw.exe at this file. Clicking the icon should "just work":

  1. If the Cockpit is already running, open a new Chrome --app window
     pointed at the existing process and exit. No second Flask, no
     port conflict.
  2. Start Flask in the main thread.
  3. Warm-fire /api/system/bootstrap so the topbar paints with live
     state on the first browser frame.
  4. Open Chrome (or Edge) in --app mode at http://127.0.0.1:5000/.

All subprocesses use CREATE_NO_WINDOW so no console windows flash. The
file extension is .pyw so Windows launches it under pythonw.exe with no
parent console of its own.
"""
from __future__ import annotations

import json
import os
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


# ----------------------------------------------------------------------
# Singleton
# ----------------------------------------------------------------------

def is_existing_cockpit(host: str, port: int) -> bool:
    """True if a Cockpit instance is already serving on this port.

    Two-step: socket connect (cheap) then verify the response shape from
    /api/config so we don't mistake a foreign process holding the port
    for our Cockpit.

    Anchor: app.py exposes `cockpit_version` in /api/config as the
    Cockpit-specific identifier. Foreign Flask apps on the same port
    won't include it.

    Pre-2026-05-18 history: the previous singleton anchor was
    `preferred_zones`, a Roon-era config key. When v0.9 removed Roon
    integration, `preferred_zones` left /api/config, and the singleton
    check started returning False on every shortcut click. Windows
    SO_REUSEADDR masked the bind collision, so a second Flask process
    spawned silently. The `cockpit_version` anchor is the post-Roon
    replacement.
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
    return isinstance(data, dict) and "cockpit_version" in data


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
        # 0.0.0.0 is Flask's bind address; the browser always connects via loopback.
        connect_host = "127.0.0.1" if host == "0.0.0.0" else host
        url = f"http://{connect_host}:{port}"

        # 1. Singleton: if Cockpit already running, just (re)open the window.
        if is_existing_cockpit(connect_host, port):
            if not open_app_window(url):
                webbrowser.open(url)
            return

        # 2. Schedule post-boot helper (waits for port, warms bootstrap,
        #    opens Chrome). Daemon so it exits with the main thread.
        t = threading.Thread(
            target=_post_boot, args=(connect_host, port, url), daemon=True
        )
        t.start()

        # 3. Run Flask in the main thread. This is where the launcher
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
