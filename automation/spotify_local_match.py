import json
import re
from pathlib import Path
from difflib import SequenceMatcher

NOISE_PATTERNS = [
    r"^\d+\s*[-._)]\s*",                  # leading track numbers like 01 - ...
    r"\bremaster(ed)?\b",
    r"\b\d{4}\s*remaster(ed)?\b",
    r"\bdeluxe\b",
    r"\bexpanded\b",
    r"\bedition\b",
    r"\bversion\b",
    r"\blive\b",
    r"\bmono\b",
    r"\bstereo\b",
    r"\bexplicit\b",
    r"\bclean\b",
    r"\bbonus track\b",
    r"\bradio edit\b",
    r"\bsingle edit\b",
    r"\bacoustic\b",
]


def clean_text(s: str) -> str:
    if not s:
        return ""
    text = str(s).lower()
    text = text.replace("&", " and ")
    text = re.sub(r"\([^)]*\)", " ", text)
    text = re.sub(r"\[[^\]]*\]", " ", text)
    for pattern in NOISE_PATTERNS:
        text = re.sub(pattern, " ", text, flags=re.IGNORECASE)
    text = re.sub(r"[_\-./]+", " ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def build_local_variants(item):
    stem = item.get("stem") or ""
    filename = item.get("filename") or ""
    artist = item.get("artist_guess") or ""
    album = item.get("album_guess") or ""

    variants = {
        clean_text(stem),
        clean_text(filename),
        clean_text(re.sub(r"^\d+\s*[-._)]\s*", "", stem)),
        clean_text(re.sub(r"^\d+\s*[-._)]\s*", "", filename)),
    }
    variants.discard("")

    return {
        "path": item.get("path"),
        "filename": filename,
        "stem": stem,
        "artist_guess": artist,
        "album_guess": album,
        "artist_clean": clean_text(artist),
        "album_clean": clean_text(album),
        "track_variants": sorted(variants),
    }


def choose_best_match(spotify_track, local_tracks, min_score=0.84):
    s_artist = clean_text(spotify_track.get("spotify_artist_name"))
    s_album = clean_text(spotify_track.get("spotify_album_name"))
    s_track = clean_text(spotify_track.get("spotify_track_name"))

    best = None
    best_score = 0.0

    for local in local_tracks:
        artist_score = similarity(s_artist, local["artist_clean"])
        album_score = similarity(s_album, local["album_clean"]) if s_album and local["album_clean"] else 0.0
        track_score = max((similarity(s_track, v) for v in local["track_variants"]), default=0.0)

        score = (track_score * 0.65) + (artist_score * 0.30) + (album_score * 0.05)

        if score > best_score:
            best_score = score
            best = {
                "local_track": local,
                "score": round(score, 4),
                "track_score": round(track_score, 4),
                "artist_score": round(artist_score, 4),
                "album_score": round(album_score, 4),
            }

    if best and best["score"] >= min_score:
        return best

    return None


def main():
    repo_root = Path(__file__).resolve().parents[1]

    local_index = json.loads(
        (repo_root / "data" / "library_index" / "library_index.json").read_text(encoding="utf-8")
    )
    spotify_data = json.loads(
        (repo_root / "data" / "spotify" / "spotify_library.json").read_text(encoding="utf-8")
    )

    local_tracks = []
    for source in local_index.get("sources", []):
        for item in source.get("items", []):
            local_tracks.append(build_local_variants(item))

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
        })

    matched = []
    unmatched_spotify = []

    for spotify_track in spotify_tracks:
        best = choose_best_match(spotify_track, local_tracks)
        if best:
            matched.append({
                "spotify_artist_name": spotify_track["spotify_artist_name"],
                "spotify_track_name": spotify_track["spotify_track_name"],
                "spotify_album_name": spotify_track["spotify_album_name"],
                "spotify_id": spotify_track["spotify_id"],
                "match_score": best["score"],
                "track_score": best["track_score"],
                "artist_score": best["artist_score"],
                "album_score": best["album_score"],
                "local_match": {
                    "path": best["local_track"]["path"],
                    "filename": best["local_track"]["filename"],
                    "stem": best["local_track"]["stem"],
                    "artist_guess": best["local_track"]["artist_guess"],
                    "album_guess": best["local_track"]["album_guess"],
                },
            })
        else:
            unmatched_spotify.append(spotify_track)

    output = {
        "local_track_count": len(local_tracks),
        "spotify_saved_track_count": len(spotify_tracks),
        "matched_count": len(matched),
        "unmatched_spotify_count": len(unmatched_spotify),
        "matched": matched,
        "unmatched_spotify": unmatched_spotify,
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