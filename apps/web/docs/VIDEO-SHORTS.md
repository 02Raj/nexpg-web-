# Automated Shorts / Reels (RunMyPG)

Local pipeline — no CapCut. Same **Sarvam** key as platform contact drafts.

```powershell
cd video-agent
.\setup.ps1
# Add clips: dashboard.mp4, tenants.mp4, rent.mp4
.\run-runmypg.ps1 "Chase PG rent without WhatsApp chaos"
```

Output: `video-agent/out/<slug>/final.mp4`

**Keys:** only `SARVAM_API_KEY` (in `video-agent/.env` or repo `.env.local`).

Platform admin: **Growth → Video shorts** in the sidebar.
