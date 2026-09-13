"""ASS karaoke captions: Whisper (optional) or lightweight timing from script."""

from __future__ import annotations

import re
from pathlib import Path

from config import H, W, WHISPER_MODE

ASS_HEAD = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Pop,Arial,104,&H00FFFFFF,&H00000000,&H90000000,1,1,7,3,2,80,80,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
HILITE = r"{\c&H000BA5F5&\fscx112\fscy112}"


def ts(t: float) -> str:
    cs = int(round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def _words_whisper(wav: Path) -> list[tuple[float, float, str]]:
    from faster_whisper import WhisperModel

    size = {"tiny": "tiny.en", "small": "small.en"}.get(WHISPER_MODE, "tiny.en")
    model = WhisperModel(size, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(wav), word_timestamps=True, vad_filter=True)
    out: list[tuple[float, float, str]] = []
    for seg in segments:
        if not seg.words:
            continue
        for w in seg.words:
            if w.word and w.word.strip():
                out.append((w.start, w.end, w.word.strip()))
    return out


def _words_from_scenes(
    scenes: list[dict], scene_durations: list[float]
) -> list[tuple[float, float, str]]:
    """No ML — split each scene VO evenly across words."""
    words: list[tuple[float, float, str]] = []
    t = 0.0
    for sc, dur in zip(scenes, scene_durations):
        tokens = re.findall(r"\S+", sc["vo"])
        if not tokens:
            t += dur
            continue
        slot = dur / len(tokens)
        for tok in tokens:
            words.append((t, t + slot * 0.95, tok))
            t += slot
    return words


def build_ass(
    dest: Path,
    wav: Path,
    scenes: list[dict],
    scene_durations: list[float],
    per_line: int = 3,
) -> None:
    if WHISPER_MODE in ("tiny", "small"):
        word_list = _words_whisper(wav)
    else:
        word_list = _words_from_scenes(scenes, scene_durations)

    lines = [ASS_HEAD]
    for i in range(0, len(word_list), per_line):
        group = word_list[i : i + per_line]
        for j, (start, end, _) in enumerate(group):
            text = " ".join(
                f"{HILITE}{w}{{\\r}}" if k == j else w for k, (_, _, w) in enumerate(group)
            )
            lines.append(f"Dialogue: 0,{ts(start)},{ts(end)},Pop,,0,0,0,,{text}")
    dest.write_text("\n".join(lines), encoding="utf-8")
