@echo off
if not exist "%~dp0.secrets\admin-password.txt" (
  echo Demo password file not found.
  pause
  exit /b 1
)
notepad.exe "%~dp0.secrets\admin-password.txt"
