"""Load brand + env (video-agent/.env or repo .env.local)."""

from __future__ import annotations

import json
import os
from pathlib import Path

ROOT = Path(__file__).parent
CLIPS = ROOT / "clips"
MUSIC = ROOT / "music" / "bed.mp3"
OUT = ROOT / "out"
BRAND_DIR = ROOT / "brand"

W, H, FPS = 1080, 1920, 30


def _load_dotenv_files() -> None:
    candidates = [
        ROOT / ".env",
        ROOT / ".env.local",
        ROOT.parent / ".env.local",
        Path(os.getenv("VIDEO_AGENT_ENV", "")) if os.getenv("VIDEO_AGENT_ENV") else None,
    ]
    for path in candidates:
        if not path or not path.is_file():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            key, val = key.strip(), val.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = val


_load_dotenv_files()

SARVAM_KEY = os.getenv("SARVAM_API_KEY", "").strip()
SARVAM_SPEAKER = os.getenv("SARVAM_TTS_SPEAKER", "anushka")
SARVAM_LANG = os.getenv("SARVAM_TTS_LANG", "en-IN")
SARVAM_CHAT_MODEL = os.getenv("SARVAM_CHAT_MODEL", "sarvam-105b")
SCRIPT_PROVIDER = os.getenv("SCRIPT_PROVIDER", "sarvam").lower()  # sarvam | ollama | template
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b-instruct")
WHISPER_MODE = os.getenv("WHISPER_MODE", "off").lower()  # off | tiny | small


def load_brand() -> dict:
    slug = os.getenv("BRAND", "tutorpe").strip().lower()
    path = BRAND_DIR / f"{slug}.json"
    if not path.is_file():
        raise SystemExit(f"Unknown BRAND={slug}. Add {path}")
    return json.loads(path.read_text(encoding="utf-8"))
