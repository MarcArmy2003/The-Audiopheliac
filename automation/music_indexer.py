import json
from pathlib import Path
from datetime import datetime, timezone

AUDIO_EXTENSIONS = {".flac", ".mp3", ".m4a", ".aac", ".wav", ".aiff", ".alac", ".ogg", ".opus"}


def iso_utc(ts: float) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()


def safe_str(value):
    return str(value).replace("\\", "/")


def infer_artist_album(root: Path, file_path: Path):
    try:
        rel = file_path.relative_to(root)
        parts = rel.parts
        artist = parts[0] if len(parts) >= 2 else None
        album = parts[1] if len(parts) >= 3 else None
        return artist, album
    except Exception:
        return None, None


def scan_root(root_path: str, excluded_segments=None):
    root = Path(root_path)
    items = []
    excluded = set(excluded_segments or [])

    if not root.exists():
        return {
            "root": safe_str(root),
            "exists": False,
            "count": 0,
            "items": []
        }

    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in AUDIO_EXTENSIONS:
            continue
        if excluded and excluded.intersection(path.relative_to(root).parts):
            continue

        stat = path.stat()
        artist, album = infer_artist_album(root, path)

        items.append({
            "path": safe_str(path),
            "relative_path": safe_str(path.relative_to(root)),
            "filename": path.name,
            "stem": path.stem,
            "extension": path.suffix.lower(),
            "size_bytes": stat.st_size,
            "modified_utc": iso_utc(stat.st_mtime),
            "artist_guess": artist,
            "album_guess": album
        })

    return {
        "root": safe_str(root),
        "exists": True,
        "count": len(items),
        "items": items
    }


def main():
    repo_root = Path(__file__).resolve().parents[1]
    config_path = repo_root / "config" / "music_sources.json"
    output_path = repo_root / "data" / "library_index" / "library_index.json"

    config = json.loads(config_path.read_text(encoding="utf-8"))

    roots = [config["flac_library_root"], *config.get("additional_music_roots", [])]
    excluded_segments = config.get("excluded_path_segments", [])

    results = [scan_root(root, excluded_segments) for root in roots]

    payload = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "roots_scanned": len(roots),
        "audio_extensions": sorted(AUDIO_EXTENSIONS),
        "sources": results,
        "total_tracks": sum(source["count"] for source in results)
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote {output_path}")
    print(f"Total tracks indexed: {payload['total_tracks']}")


if __name__ == "__main__":
    main()