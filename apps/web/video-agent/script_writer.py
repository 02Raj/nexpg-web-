"""Script generation: Sarvam (default, cheap) -> Ollama (optional) -> template (offline)."""

from __future__ import annotations

import json
import re
from typing import Any

import requests

from config import (
    OLLAMA_HOST,
    OLLAMA_MODEL,
    SARVAM_CHAT_MODEL,
    SARVAM_KEY,
    SCRIPT_PROVIDER,
    load_brand,
)


def _system_prompt(brand: dict, clip_tags: list[str]) -> str:
    hooks = "\n".join(f'  - "{h}"' for h in brand["hook_examples"])
    return f"""You write 30-45 second vertical YouTube Shorts / Instagram Reels for {brand["name"]} ({brand["domain"]}).
Audience: {brand["audience"]}.
Product: {brand["product_line"]}.

Rules:
- Scene 1 HOOK: under 12 words, pain-first, no greeting, no brand name in hook.
  Examples:
{hooks}
- Scenes 2-4: one concrete app benefit each, max 18 spoken words, conversational Indian English.
- Final scene: CTA with {brand["domain"]}, under 12 words.
- Each scene `clip` MUST be one of: {clip_tags}
- No emoji, no markdown, no hashtags in spoken lines.

Return ONLY valid JSON:
{{"title": str, "caption": str, "hashtags": [str],
 "scenes": [{{"vo": str, "clip": str, "on_screen": str}}]}}"""


def _parse_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```\w*\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    return json.loads(text)


def _fix_clips(data: dict, tags: list[str]) -> dict:
    for s in data.get("scenes", []):
        if s.get("clip") not in tags:
            s["clip"] = tags[0]
    if not data.get("hashtags"):
        data["hashtags"] = load_brand()["default_hashtags"]
    return data


def write_script_sarvam(topic: str, tags: list[str]) -> dict:
    if not SARVAM_KEY:
        raise RuntimeError("SARVAM_API_KEY missing")
    brand = load_brand()
    r = requests.post(
        "https://api.sarvam.ai/v1/chat/completions",
        headers={
            "api-subscription-key": SARVAM_KEY,
            "Content-Type": "application/json",
        },
        json={
            "model": SARVAM_CHAT_MODEL,
            "messages": [
                {"role": "system", "content": _system_prompt(brand, tags)},
                {"role": "user", "content": f"Topic: {topic}\nWrite exactly 5 scenes."},
            ],
            "max_tokens": 900,
            "temperature": 0.75,
            "n": 1,
        },
        timeout=90,
    )
    r.raise_for_status()
    body = r.json()
    text = body["choices"][0]["message"]["content"]
    return _fix_clips(_parse_json(text), tags)


def write_script_ollama(topic: str, tags: list[str]) -> dict:
    brand = load_brand()
    r = requests.post(
        f"{OLLAMA_HOST}/api/chat",
        json={
            "model": OLLAMA_MODEL,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.8},
            "messages": [
                {"role": "system", "content": _system_prompt(brand, tags)},
                {"role": "user", "content": f"Topic: {topic}\n5 scenes."},
            ],
        },
        timeout=180,
    )
    r.raise_for_status()
    return _fix_clips(_parse_json(r.json()["message"]["content"]), tags)


def write_script_template(topic: str, tags: list[str]) -> dict:
    brand = load_brand()
    hook = brand["hook_examples"][0]
    clips = tags[:4] if len(tags) >= 4 else tags * 4
    scenes = [
        {"vo": hook, "clip": clips[0], "on_screen": hook},
        {
            "vo": f"See everything in one dashboard on {brand['name']}.",
            "clip": clips[1 % len(clips)],
            "on_screen": "One dashboard",
        },
        {
            "vo": f"Reminders and records without Excel or notebooks.",
            "clip": clips[2 % len(clips)],
            "on_screen": "Less admin",
        },
        {
            "vo": f"Built for {brand['audience'].split()[0]} owners in India.",
            "clip": clips[3 % len(clips)],
            "on_screen": brand["name"],
        },
        {
            "vo": f"Try free at {brand['domain']}.",
            "clip": clips[0],
            "on_screen": brand["domain"],
        },
    ]
    return {
        "title": topic[:60],
        "caption": f"{topic} — {brand['name']} ({brand['domain']})",
        "hashtags": brand["default_hashtags"],
        "scenes": scenes,
    }


def write_script(topic: str, tags: list[str]) -> dict:
    order = {
        "sarvam": [write_script_sarvam, write_script_ollama, write_script_template],
        "ollama": [write_script_ollama, write_script_sarvam, write_script_template],
        "template": [write_script_template],
    }.get(SCRIPT_PROVIDER, [write_script_sarvam, write_script_template])

    last_err: Exception | None = None
    for fn in order:
        try:
            return fn(topic, tags)
        except Exception as e:
            last_err = e
            continue
    raise SystemExit(f"All script providers failed. Last error: {last_err}")
