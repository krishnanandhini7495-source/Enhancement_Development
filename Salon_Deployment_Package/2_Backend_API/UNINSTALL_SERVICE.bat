@echo off
REM ============================================
REM Salon Software - Uninstall Windows Service
REM ============================================

echo.
echo ================================================
echo   Uninstall Salon API Windows Service
echo ================================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

cd /d "%~dp0"

set SERVICE_NAME=SalonAPI

REM Stop service if running
echo Stopping service...
net stop %SERVICE_NAME% 2>nul

REM Remove service
if exist "nssm.exe" (
    echo Removing service...
    nssm.exe remove %SERVICE_NAME% confirm
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Service removed successfully!
    ) else (
        echo.
        echo Failed to remove service.
    )
) else (
    echo ERROR: nssm.exe not found!
    echo Please manually remove the service using:
    echo sc delete %SERVICE_NAME%
)

echo.
pause
