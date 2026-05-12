# Create-Shortcut.ps1
# Creates an Audiopheliac Cockpit desktop shortcut pointing at launch.pyw.
# Run once after `pip install -r requirements.txt` succeeds.
# Environment: PowerShell 5.1+ on GDMARCHE. No admin required.

$ErrorActionPreference = 'Stop'

$ConsoleDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ConsoleDir
$Launcher   = Join-Path $ConsoleDir 'launch.pyw'
# Canonical Audiopheliac brand mark (rainbow-spectrum vinyl with tonearm).
$IconPath   = Join-Path $ProjectDir 'media\icons\audiopheliac.ico'
$Desktop    = [Environment]::GetFolderPath('Desktop')
$LnkPath    = Join-Path $Desktop 'Audiopheliac Cockpit.lnk'

if (-not (Test-Path $Launcher)) {
    throw "Launcher not found at $Launcher. Run from inside the console directory."
}

# Prefer the venv's pythonw.exe so installed packages are visible.
# Fall back to system pythonw.exe if the venv has not been created.
$VenvPythonw = Join-Path $ConsoleDir '.venv\Scripts\pythonw.exe'
if (Test-Path $VenvPythonw) {
    $Target = $VenvPythonw
} else {
    $cmd = Get-Command pythonw.exe -ErrorAction SilentlyContinue
    if (-not $cmd) {
        throw "pythonw.exe not found. Install Python or create the venv first (see README.md)."
    }
    $Target = $cmd.Source
}

$WshShell = New-Object -ComObject WScript.Shell
$lnk = $WshShell.CreateShortcut($LnkPath)
$lnk.TargetPath       = $Target
$lnk.Arguments        = '"' + $Launcher + '"'
$lnk.WorkingDirectory = $ConsoleDir
$lnk.WindowStyle      = 7   # Minimized (pythonw has no window anyway)
$lnk.Description      = 'The Audiopheliac Cockpit. Local Yamaha R-N800A control via YXC.'
if (Test-Path $IconPath) {
    $lnk.IconLocation = "$IconPath,0"
}
$lnk.Save()

Write-Host ("Shortcut created: " + $LnkPath)
Write-Host ("Target:           " + $Target)
Write-Host ("Arguments:        " + $lnk.Arguments)
if (Test-Path $IconPath) {
    Write-Host ("Icon:             " + $IconPath)
} else {
    Write-Host ""
    Write-Host ("Note: canonical icon not present at " + $IconPath)
    Write-Host "Generate it from media/icons/pack_brand_icon.py, then re-run this script."
}
