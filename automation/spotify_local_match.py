import json
from pathlib import Path
def norm(s):
    if not s:
        return ""
    return "".join(ch.lower() for ch in str(s) if ch.isalnum() or ch.isspace()).strip()
def main():
    repo_root = Path(__file__).resolve().parents[1]
    local_index = json.loads((repo_root / "data" / "library_index" / "library_index.json").read_text(encoding="utf-8"))
    spotify_data = json.loads((repo_root / "data" / "spotify" / "spotify_library.json").read_text(encoding="utf-8"))
    local_tracks = []
    for source in local_index.get("sources", []):
        for item in source.get("items", []):
            local_tracks.append({
                "path": item.get("path"),
                "filename": item.get("filename"),
                "stem": item.get("stem"),
                "artist_guess": item.get("artist_guess"),
                "album_guess": item.get("album_guess"),
                "match_key": norm(item.get("artist_guess")) + " | " + norm(item.get("stem"))
            })
    spotify_tracks = []
    for item in spotify_data.get("saved_tracks", []):
        track = item.get("track", {})
        artists = track.get("artists", [])
        first_artist = artists[0]["name"] if artists else ""
        spotify_tracks.append({
            "spotify_track_name": track.get("name"),
            "spotify_album_name": (track.get("album") or {}).get("name"),
            "spotify_artist_name": first_artist,
            "spotify_id": track.get("id"),
            "match_key": norm(first_artist) + " | " + norm(track.get("name"))
        })
    local_by_key = {}
    for track in local_tracks:
        local_by_key.setdefault(track["match_key"], []).append(track)
    matched = []
    unmatched_spotify = []
    for s in spotify_tracks:
        candidates = local_by_key.get(s["match_key"], [])
        if candidates:
            matched.append({
                "spotify_artist_name": s["spotify_artist_name"],
                "spotify_track_name": s["spotify_track_name"],
                "spotify_album_name": s["spotify_album_name"],
                "spotify_id": s["spotify_id"],
                "local_matches": candidates
            })
        else:
            unmatched_spotify.append(s)
    output = {
        "local_track_count": len(local_tracks),
        "spotify_saved_track_count": len(spotify_tracks),
        "matched_count": len(matched),
        "unmatched_spotify_count": len(unmatched_spotify),
        "matched": matched,
        "unmatched_spotify": unmatched_spotify
    }
    out_path = repo_root / "data" / "manifests" / "spotify_local_matches.json"
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {out_path}")
    print(f"Local tracks: {len(local_tracks)}")
    print(f"Spotify saved tracks: {len(spotify_tracks)}")
    print(f"Matched: {len(matched)}")
    print(f"Unmatched Spotify tracks: {len(unmatched_spotify)}")
if __name__ == "__main__":
    main()
