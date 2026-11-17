"""TEMPORARY placeholders only — grey test clips make a boring video.

Run once if you have zero MP4s, then REPLACE each file with a real screen recording.

  .\\.venv\\Scripts\\python.exe generate_dummies.py
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
CLIPS = ROOT / "clips"

# Names must match what Sarvam script uses (see brand + script_writer).
PLACEHOLDERS: list[tuple[str, str, str]] = [
    ("dashboard.mp4", "0x1e3a5f", "RECORD: RunMyPG dashboard"),
    ("rent.mp4", "0x2d4a3e", "RECORD: rent / dues screen"),
    ("tenants.mp4", "0x4a2d5c", "RECORD: tenants / beds"),
]


def run(args: list[str]) -> None:
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit(p.stderr or p.stdout or "ffmpeg failed")


def make_clip(dest: Path, color: str, label: str) -> None:
    text = label.replace(":", "\\:").replace("'", "\\'")
    vf = (
        f"drawtext=fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:text='{text}'"
        f":fontsize=52:fontcolor=white:borderw=4:bordercolor=black"
        f":x=(w-text_w)/2:y=(h-text_h)/2"
        f":line_spacing=8"
    )
    run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"color=c={color}:s=1080x1920:d=5",
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            str(dest),
        ]
    )


def main() -> None:
    CLIPS.mkdir(parents=True, exist_ok=True)
    print("Creating labeled placeholders (NOT a real app demo).")
    print("Replace each file in clips/ with Win+G screen recording of RunMyPG.\n")
    for name, color, label in PLACEHOLDERS:
        path = CLIPS / name
        make_clip(path, color, label)
        print(f"  {path}")
    print("\nNext: record 10–20s MP4s → clips/dashboard.mp4, rent.mp4, tenants.mp4")
    print("Then: .\\run-runmypg.ps1 \"Your topic\"")


if __name__ == "__main__":
    try:
        main()
    except FileNotFoundError:
        sys.exit("ffmpeg not found. Run .\\setup.ps1 first.")
