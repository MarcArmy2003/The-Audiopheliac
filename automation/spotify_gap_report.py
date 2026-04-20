import json
from pathlib import Path


def main():
    repo_root = Path(__file__).resolve().parents[1]

    matches = json.loads(
        (repo_root / "data" / "manifests" / "spotify_local_matches.json").read_text(encoding="utf-8")
    )

    unmatched = matches.get("unmatched_spotify", [])

    lines = []
    lines.append("=== SPOTIFY TRACKS NOT IN LOCAL LIBRARY ===\n")
    lines.append(f"Total missing tracks: {len(unmatched)}\n\n")

    for t in unmatched:
        artist = t.get("spotify_artist_name", "Unknown Artist")
        track = t.get("spotify_track_name", "Unknown Track")
        album = t.get("spotify_album_name", "Unknown Album")

        lines.append(f"{artist} - {track} [{album}]\n")

    output_path = repo_root / "data" / "manifests" / "spotify_missing_tracks.txt"
    output_path.write_text("".join(lines), encoding="utf-8")

    print(f"Wrote {output_path}")
    print(f"Missing tracks: {len(unmatched)}")


if __name__ == "__main__":
    main()