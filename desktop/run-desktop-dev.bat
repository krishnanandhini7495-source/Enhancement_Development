@echo off
REM This script launches the Tauri desktop app with GNU toolchain and MinGW

echo Adding MinGW and Rust (GNU toolchain) to PATH...
set PATH=C:\msys64\mingw64\bin;%USERPROFILE%\.cargo\bin;%PATH%

echo.
echo Starting Tauri Desktop App...
cd /d "%~dp0"
npm run dev:tauri
