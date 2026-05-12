"""Audiopheliac Cockpit launcher.

Starts Flask in a background thread and opens Chrome (or Edge) in --app
mode so the dashboard window has no URL bar, no tabs, and feels like a
native application.

Associated with pythonw.exe (the .pyw extension), so launching it from a
Windows shortcut produces no console window.
"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path


HERE = Path(__file__).resolve().parent


def wait_for_port(host: str, port: int, timeout: float = 15.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=0.5):
                return True
        except OSError:
            time.sleep(0.2)
    return False


def start_flask() -> None:
    os.chdir(HERE)
    sys.path.insert(0, str(HERE))
    from app import app, config  # imported here so the daemon thread owns it
    app.run(
        host=config["host"],
        port=int(config["port"]),
        debug=False,
        use_reloader=False,
    )


def open_app_window(url: str) -> bool:
    """Try Chrome, then Edge, in --app mode. Fall back to default browser."""
    candidates = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    ]
    for path in candidates:
        if Path(path).exists():
            subprocess.Popen([
                path,
                f"--app={url}",
                "--window-size=1280,820",
                "--disable-features=TranslateUI",
            ])
            return True
    return False


def main() -> None:
    cfg_path = HERE / "config.json"
    cfg = {"host": "127.0.0.1", "port": 5000}
    if cfg_path.exists():
        with cfg_path.open("r", encoding="utf-8") as f:
            cfg.update(json.load(f))

    t = threading.Thread(target=start_flask, daemon=True)
    t.start()

    host = cfg["host"]
    port = int(cfg["port"])
    if not wait_for_port(host, port):
        sys.exit(1)

    url = f"http://{host}:{port}"
    if not open_app_window(url):
        webbrowser.open(url)

    # Keep the launcher process alive so the Flask thread keeps serving.
    t.join()


if __name__ == "__main__":
    main()
