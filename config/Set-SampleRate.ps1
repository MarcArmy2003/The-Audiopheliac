# -------------------------------------------
# The Audiopheliac – Focusrite Sample Rate Switcher
# Author: Gillon Marche (System: GDMARCHE)
# Version: 1.0 | Updated: 2025-12-17
# -------------------------------------------

# SETTINGS
$deviceName = "Focusrite USB"     # Adjust if Windows lists differently
$mode = Read-Host "Enter mode: (L)istening 44.1kHz or (P)roduction 48kHz?"

# DETECT AUDIO DEVICE
$device = Get-WmiObject -Class Win32_SoundDevice | Where-Object { $_.Name -like "*$deviceName*" }

if (-not $device) {
    Write-Host "⚠️  Focusrite device not found. Check USB connection." -ForegroundColor Yellow
    exit
}

# DEFINE TARGET SAMPLE RATE
switch ($mode.ToUpper()) {
    "L" { $rate = 44100; $desc = "Listening Mode (44.1 kHz)" }
    "P" { $rate = 48000; $desc = "Production Mode (48 kHz)" }
    default {
        Write-Host "❌ Invalid input. Use L or P."
        exit
    }
}

# CHANGE SAMPLE RATE (requires SoundVolumeView utility)
$svv = "$env:ProgramFiles\NirSoft\SoundVolumeView\SoundVolumeView.exe"

if (-not (Test-Path $svv)) {
    Write-Host "⚠️  SoundVolumeView not found. Download it from: https://www.nirsoft.net/utils/sound_volume_view.html"
    Write-Host "Place it in: $env:ProgramFiles\NirSoft\SoundVolumeView"
    exit
}

# EXECUTE SWITCH
Write-Host "🔄 Setting Focusrite to $desc..." -ForegroundColor Cyan
Start-Process -FilePath $svv -ArgumentList "setdefault \"Focusrite USB\" 1" -Wait
Start-Process -FilePath $svv -ArgumentList "setplaybackrate \"Focusrite USB\" $rate" -Wait

Write-Host "✅ Focusrite set to $desc ($rate Hz)" -ForegroundColor Green
Write-Host "You can verify in: Control Panel → Sound → Playback → Focusrite USB → Advanced."

$current = (Get-ItemProperty -Path "HKCU:\Software\Microsoft\Multimedia\Sound Mapper").PlaybackFormat
if ($current -like "*44100*") {
    & "D:\The Audiopheliac\Scripts\Set-SampleRate.ps1" P
} else {
    & "D:\The Audiopheliac\Scripts\Set-SampleRate.ps1" L
}

