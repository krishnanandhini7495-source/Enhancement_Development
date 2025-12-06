@echo off
REM ============================================
REM Salon Software - Backend API Startup Script
REM ============================================

echo.
echo ================================================
echo   Salon Software - Starting Backend API
echo ================================================
echo.

cd /d "%~dp0SalonAPI"

REM Check if .NET Runtime is installed
dotnet --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: .NET Runtime not found!
    echo Please install .NET 9.0 Runtime from:
    echo https://dotnet.microsoft.com/download/dotnet/9.0
    echo.
    pause
    exit /b 1
)

echo Starting API on http://localhost:5000...
echo Press Ctrl+C to stop the server.
echo.

REM Start the API
dotnet SalonSoftware.API.dll

pause
