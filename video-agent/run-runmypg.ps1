$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:BRAND = "runmypg"
if (-not (Test-Path .venv)) { & .\setup.ps1 }
$topic = if ($args.Count -gt 0) { $args -join " " } else { "PG rent collection dashboard" }
.\.venv\Scripts\python.exe agent.py $topic
