# One-time setup (TutorPe repo)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "Installing FFmpeg (required)..." -ForegroundColor Yellow
    winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
}

python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt

New-Item -ItemType Directory -Force -Path clips, music, out | Out-Null
if (-not (Test-Path clips\.gitkeep)) { New-Item -ItemType File -Path clips\.gitkeep | Out-Null }

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created video-agent/.env - add SARVAM_API_KEY" -ForegroundColor Cyan
}

Write-Host "Setup OK. Add MP4s to clips/ then run: .\run-runmypg.ps1 'Your topic'" -ForegroundColor Green
