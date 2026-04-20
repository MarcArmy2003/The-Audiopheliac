import os
import json
import webbrowser
from urllib.parse import urlencode
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import requests

def load_env(path):
    env = {}
    for line in Path(path).read_text().splitlines():
        if "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env

class CallbackHandler(BaseHTTPRequestHandler):
    code = None

    def do_GET(self):
        if "code=" in self.path:
            CallbackHandler.code = self.path.split("code=")[1].split("&")[0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Auth successful. You can close this window.")
        else:
            self.send_response(400)
            self.end_headers()

def get_token(client_id, client_secret, redirect_uri):
    auth_url = "https://accounts.spotify.com/authorize"
    params = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": "user-library-read playlist-read-private"
    }

    webbrowser.open(f"{auth_url}?{urlencode(params)}")

    server = HTTPServer(("127.0.0.1", 8888), CallbackHandler)
    server.handle_request()

    code = CallbackHandler.code

    token_url = "https://accounts.spotify.com/api/token"
    resp = requests.post(token_url, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret
    })

    return resp.json()["access_token"]

def fetch_all(url, headers):
    items = []
    while url:
        resp = requests.get(url, headers=headers).json()
        items.extend(resp.get("items", []))
        url = resp.get("next")
    return items

def main():
    repo_root = Path(__file__).resolve().parents[1]
    env = load_env(repo_root / "config" / "spotify.env")

    token = get_token(
        env["SPOTIFY_CLIENT_ID"],
        env["SPOTIFY_CLIENT_SECRET"],
        env["SPOTIFY_REDIRECT_URI"]
    )

    headers = {"Authorization": f"Bearer {token}"}

    saved_tracks = fetch_all(
        "https://api.spotify.com/v1/me/tracks?limit=50",
        headers
    )

    playlists = fetch_all(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        headers
    )

    output = {
        "saved_tracks_count": len(saved_tracks),
        "playlists_count": len(playlists),
        "saved_tracks": saved_tracks,
        "playlists": playlists
    }

    out_path = repo_root / "data" / "spotify" / "spotify_library.json"
    out_path.write_text(json.dumps(output, indent=2), encoding="utf-8")

    print(f"Wrote {out_path}")
    print(f"Saved tracks: {len(saved_tracks)}")
    print(f"Playlists: {len(playlists)}")

if __name__ == "__main__":
    main()
