import argparse
import os
from datetime import datetime

# Resolve project root relative to this script (automation/ is one level below root)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The Audiopheliac Canonical Sonic Priorities
# Source: CLAUDE.md -> LISTENING PROFILE
SONIC_PRIORITIES = "bass-conscious, full low mids, clear lead vocals, muscular drums, high-fidelity, hi-fi, wide soundstage"

GENRE_MAP = {
    "rock": "classic rock, hard rock, driving rhythm, analog warmth",
    "country": "modern country, storytelling, acoustic resonance, steel guitar",
    "blues": "blues-rock, gritty authenticity, electric guitar lead, shuffle groove",
    "pop": "crossover pop, tight production, punchy bass, pristine vocals",
    "hiphop": "selective hip-hop, heavy low end, rhythmic flow, crisp hi-hats"
}

def generate_style_prompt(base_genre, mood, tempo):
    """Generates a Suno 'Style of Music' prompt string."""
    genre_tags = GENRE_MAP.get(base_genre.lower(), base_genre)
    
    components = [
        genre_tags,
        SONIC_PRIORITIES,
        f"{mood} mood",
        f"{tempo} tempo"
    ]
    
    return ", ".join(components)

def generate_lyric_scaffolding(title, structure):
    """Generates standard Suno metatags for lyrics based on desired structure."""
    scaffold = []
    if title:
        scaffold.append(f"[Title: {title}]")
        
    structure_map = {
        "standard": ["[Verse 1]", "[Chorus]", "[Verse 2]", "[Chorus]", "[Bridge]", "[Guitar Solo]", "[Chorus]", "[Outro]"],
        "simple": ["[Verse 1]", "[Chorus]", "[Verse 2]", "[Chorus]", "[Outro]"],
        "epic": ["[Intro]", "[Verse 1]", "[Pre-Chorus]", "[Chorus]", "[Verse 2]", "[Pre-Chorus]", "[Chorus]", "[Bridge]", "[Instrumental Break]", "[Chorus]", "[Big Outro]"]
    }
    
    scaffold.extend(structure_map.get(structure.lower(), structure_map["standard"]))
    
    # Return with empty lines between tags to allow for user input
    return "\n\n".join(scaffold) + "\n"

def main():
    parser = argparse.ArgumentParser(description="Suno Prompt Generator for The Audiopheliac")
    parser.add_argument("--genre", type=str, required=True, help="Base genre (e.g., rock, country, blues, pop, hiphop)")
    parser.add_argument("--mood", type=str, default="energetic", help="Emotional mood (e.g., energetic, melancholic, driving)")
    parser.add_argument("--tempo", type=str, default="mid-tempo", help="Tempo (e.g., slow, mid-tempo, fast, 120bpm)")
    parser.add_argument("--title", type=str, default="", help="Working title of the track")
    parser.add_argument("--structure", type=str, default="standard", choices=["standard", "simple", "epic"], help="Song structure template")
    parser.add_argument("--output", action="store_true", help="Save the generated prompt to the Suno directory")
    
    args = parser.parse_args()
    
    style_prompt = generate_style_prompt(args.genre, args.mood, args.tempo)
    lyrics = generate_lyric_scaffolding(args.title, args.structure)
    
    output_text = (
        f"--- SUNO PROMPT GENERATOR ---\n"
        f"Target Engine: Suno v5.5 (Custom Mode)\n\n"
        f"[ STYLE OF MUSIC ] (Copy this into the Style box):\n"
        f"{style_prompt}\n\n"
        f"[ LYRICS ] (Copy this into the Lyrics box and fill in):\n"
        f"{lyrics}\n"
    )
    
    print(output_text)
    
    if args.output:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"Suno_Prompt_{args.genre}_{timestamp}.txt"
        filepath = os.path.join(PROJECT_ROOT, "Suno", filename)
        
        try:
            with open(filepath, "w") as f:
                f.write(output_text)
            print(f"Saved to: {filepath}")
        except Exception as e:
            print(f"Error saving file: {e}")

if __name__ == "__main__":
    main()
