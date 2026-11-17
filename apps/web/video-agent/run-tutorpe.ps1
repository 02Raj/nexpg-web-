$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:BRAND = "tutorpe"
if (-not (Test-Path .venv)) { & .\setup.ps1 }
$topic = if ($args.Count -gt 0) { $args -join " " } else { "WhatsApp fee reminders" }
.\.venv\Scripts\python.exe agent.py $topic
