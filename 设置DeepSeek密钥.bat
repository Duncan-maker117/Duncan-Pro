@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\configure-deepseek.ps1"
if errorlevel 1 (echo Setup failed. & pause & exit /b 1)
echo Setup finished. You may close this window.
pause
