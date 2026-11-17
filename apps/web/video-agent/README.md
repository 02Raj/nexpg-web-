# Video shorts agent (TutorPe / RunMyPG)

Fully automated Shorts/Reels from **screen recordings + Sarvam voice + captions**.

## API keys you need

| Key | Required? | Purpose |
|-----|-----------|---------|
| **SARVAM_API_KEY** | **Yes** | Script (chat) + voiceover (TTS) |
| Ollama | No | Only if `SCRIPT_PROVIDER=ollama` |

The agent auto-reads `video-agent/.env.local` (or `.env`) and the repo root `.env.local` (`SARVAM_API_KEY`). Copy from `.env.example` if needed.

## One-time setup (Windows)

```powershell
cd video-agent
.\setup.ps1
```

Installs FFmpeg, Python venv, creates `clips/`.

## Record clips once (required for real app visuals)

The agent does **not** render your UI from code. It only uses **your MP4 screen recordings**.

**Hinglish guide:** [docs/RECORD-CLIPS.md](./docs/RECORD-CLIPS.md)

Drop in `clips/` — **filename = tag** (no spaces):

- `dashboard.mp4` — main console
- `rent.mp4` — rent / dues
- `tenants.mp4` — beds / tenants

10–20s each (Win+G or OBS). Cropped to 9:16 automatically.

Do **not** use old tiny grey test clips — video will look like “only color changing”.

## Run (TutorPe)

```powershell
.\run-tutorpe.ps1 "Fee Intelligence: who to chase first"
```

Output: `out/<slug>/final.mp4` + `caption.txt`.

## Run (RunMyPG)

Use the copy in `P:\nexpg-web-\video-agent` → `.\run-runmypg.ps1 "Rent collection dashboard"`.

## Lightweight defaults (no Ollama)

- `SCRIPT_PROVIDER=sarvam` — hooks via Sarvam API (~few paise/short)
- `WHISPER_MODE=off` — captions timed from script (no Whisper download)
- Set `WHISPER_MODE=tiny` + `pip install faster-whisper` for word-perfect karaoke
