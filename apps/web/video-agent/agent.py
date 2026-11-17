"""Faceless shorts: script -> Sarvam TTS -> captions -> FFmpeg.

  .\\run-tutorpe.ps1 \"Fee reminders in one tap\"

Put screen recordings in clips/*.mp4 (name = tag used in script).
"""

from __future__ import annotations

import base64
import json
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

import requests

from captions import build_ass
from config import CLIPS, MUSIC, OUT, SARVAM_KEY, SARVAM_LANG, SARVAM_SPEAKER, W, H, FPS
from script_writer import write_script

TTS_CHUNK = 450


@dataclass
class Scene:
    vo: str
    clip: str
    on_screen: str
    wav: Path | None = None
    dur: float = 0.0


def clip_tags() -> list[str]:
    return sorted(p.stem for p in CLIPS.glob("*.mp4"))


def chunk(text: str, size: int = TTS_CHUNK) -> list[str]:
    parts, buf = [], ""
    for sentence in re.split(r"(?<=[.!?])\s+", text.strip()):
        if len(buf) + len(sentence) + 1 > size:
            parts.append(buf.strip())
            buf = ""
        buf += sentence + " "
    if buf.strip():
        parts.append(buf.strip())
    return parts or [text]


def tts(text: str, dest: Path) -> Path:
    if not SARVAM_KEY:
        sys.exit("SARVAM_API_KEY missing. Add to video-agent/.env or repo .env.local")
    r = requests.post(
        "https://api.sarvam.ai/text-to-speech",
        headers={"api-subscription-key": SARVAM_KEY, "Content-Type": "application/json"},
        json={
            "inputs": chunk(text),
            "target_language_code": SARVAM_LANG,
            "speaker": SARVAM_SPEAKER,
            "model": "bulbul:v3",
            "pace": 1.05,
            "speech_sample_rate": 24000,
            "enable_preprocessing": True,
        },
        timeout=120,
    )
    r.raise_for_status()
    pieces: list[Path] = []
    for i, b64 in enumerate(r.json()["audios"]):
        p = dest.with_name(f"{dest.stem}_{i}.wav")
        p.write_bytes(base64.b64decode(b64))
        pieces.append(p)
    concat_av(pieces, dest, audio=True)
    return dest


def run(args: list[str], cwd: Path | None = None) -> None:
    proc = subprocess.run(args, cwd=cwd, check=False, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr or proc.stdout or "ffmpeg failed")


def probe_size(path: Path) -> tuple[int, int]:
    out = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height",
            "-of",
            "csv=p=0:s=x",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    w, h = out.stdout.strip().split("x")
    return int(w), int(h)


def _drawtext_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'").replace("%", "\\%")


def duration(path: Path) -> float:
    out = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(out.stdout.strip())


def concat_av(parts: list[Path], dest: Path, audio: bool = False) -> None:
    listfile = dest.with_suffix(".txt")
    listfile.write_text(
        "".join(f"file '{p.resolve().as_posix()}'\n" for p in parts),
        encoding="utf-8",
    )
    codec = ["-c", "copy"] if not audio else ["-c:a", "pcm_s16le"]
    run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listfile.name, *codec, dest.name],
        cwd=dest.parent,
    )


def scene_video(clip: Path, dur: float, dest: Path, on_screen: str = "") -> None:
    vf = (
        f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
        f"fps={FPS},zoompan=z='min(zoom+0.0004,1.08)':d=1:s={W}x{H}"
    )
    label = on_screen.strip()
    if label:
        t = _drawtext_escape(label[:100])
        vf += (
            f",drawtext=fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:text='{t}'"
            f":fontsize=68:fontcolor=white:borderw=5:bordercolor=black"
            f":x=(w-text_w)/2:y=h*0.68:shadowcolor=black@0.5:shadowx=2:shadowy=2"
        )
    run(
        [
            "ffmpeg",
            "-y",
            "-stream_loop",
            "-1",
            "-i",
            str(clip),
            "-t",
            f"{dur:.3f}",
            "-an",
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            str(dest),
        ]
    )


def _warn_clip_quality() -> None:
    small: list[str] = []
    for p in sorted(CLIPS.glob("*.mp4")):
        try:
            w, h = probe_size(p)
        except (subprocess.CalledProcessError, ValueError):
            continue
        if w < 720 or h < 720:
            small.append(f"{p.name} ({w}x{h})")
    if small:
        print(
            "\n⚠️  Clips look like TEST files (tiny resolution), not screen recordings:\n  "
            + "\n  ".join(small)
            + "\n\n  Video will be grey/color only until you add real MP4s from Win+G / OBS.\n"
            "  See video-agent/docs/RECORD-CLIPS.md\n",
            file=sys.stderr,
        )


def build(topic: str) -> Path:
    tags = clip_tags()
    if not tags:
        sys.exit(
            f"No clips in {CLIPS}/. Record RunMyPG (Win+G) → dashboard.mp4, rent.mp4, tenants.mp4\n"
            "  Or temporary placeholders: .\\.venv\\Scripts\\python.exe generate_dummies.py"
        )

    _warn_clip_quality()

    script = write_script(topic, tags)
    slug = re.sub(r"[^a-z0-9]+", "-", script["title"].lower()).strip("-")[:50]
    work = OUT / slug
    work.mkdir(parents=True, exist_ok=True)

    scenes = [
        Scene(**{k: s[k] for k in ("vo", "clip", "on_screen")}) for s in script["scenes"]
    ]

    for i, sc in enumerate(scenes):
        sc.wav = tts(sc.vo, work / f"vo_{i}.wav")
        sc.dur = duration(sc.wav) + 0.18

    vo = work / "voice.wav"
    concat_av([s.wav for s in scenes if s.wav], vo, audio=True)

    for i, sc in enumerate(scenes):
        scene_video(CLIPS / f"{sc.clip}.mp4", sc.dur, work / f"scene_{i}.mp4", sc.on_screen)
    silent = work / "silent.mp4"
    concat_av([work / f"scene_{i}.mp4" for i in range(len(scenes))], silent)

    ass_path = work / "captions.ass"
    build_ass(
        ass_path,
        vo,
        script["scenes"],
        [s.dur for s in scenes],
    )

    inputs = ["-i", silent.name, "-i", vo.name]
    if MUSIC.exists():
        inputs += ["-i", str(MUSIC.resolve())]
        amix = "[1:a]volume=1.0[a1];[2:a]volume=0.06[a2];[a1][a2]amix=inputs=2:duration=first[a]"
    else:
        amix = "[1:a]volume=1.0[a]"

    ass_posix = "captions.ass"
    run(
        [
            "ffmpeg",
            "-y",
            *inputs,
            "-filter_complex",
            f"[0:v]ass={ass_posix}[v];{amix}",
            "-map",
            "[v]",
            "-map",
            "[a]",
            "-shortest",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "final.mp4",
        ],
        cwd=work,
    )

    caption = script["caption"] + "\n\n" + " ".join(script["hashtags"])
    (work / "caption.txt").write_text(caption, encoding="utf-8")
    (work / "script.json").write_text(json.dumps(script, indent=2), encoding="utf-8")
    return work / "final.mp4"


if __name__ == "__main__":
    topic = " ".join(sys.argv[1:]) or "Why fee registers fail"
    out = build(topic)
    print(f"Done: {out}")
