@echo off
REM ============================================
REM Salon Software - Install API as Windows Service
REM ============================================

echo.
echo ================================================
echo   Install Salon API as Windows Service
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

REM Check if NSSM exists
if not exist "nssm.exe" (
    echo ERROR: nssm.exe not found!
    echo Please download NSSM from https://nssm.cc/download
    echo and place nssm.exe in the same folder as this script.
    pause
    exit /b 1
)

REM Get dotnet.exe path
for /f "delims=" %%i in ('where dotnet.exe') do set DOTNET_PATH=%%i

if "%DOTNET_PATH%"=="" (
    echo ERROR: dotnet.exe not found in PATH!
    echo Please install .NET 9.0 Runtime.
    pause
    exit /b 1
)

REM Set paths
set SERVICE_NAME=SalonAPI
set APP_PATH=%~dp0SalonAPI\SalonSoftware.API.dll
set WORK_DIR=%~dp0SalonAPI

echo Installing service: %SERVICE_NAME%
echo Application: %APP_PATH%
echo Working Directory: %WORK_DIR%
echo.

REM Install service
nssm.exe install %SERVICE_NAME% "%DOTNET_PATH%" "%APP_PATH%"

REM Configure service
nssm.exe set %SERVICE_NAME% AppDirectory "%WORK_DIR%"
nssm.exe set %SERVICE_NAME% DisplayName "Salon Software API"
nssm.exe set %SERVICE_NAME% Description "Backend API for Salon Management System"
nssm.exe set %SERVICE_NAME% Start SERVICE_AUTO_START

REM Start service
echo Starting service...
net start %SERVICE_NAME%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   Service installed and started successfully!
    echo ================================================
    echo.
    echo Service Name: %SERVICE_NAME%
    echo API URL: http://localhost:5000
    echo.
    echo The service will start automatically with Windows.
    echo.
    echo To stop the service: net stop %SERVICE_NAME%
    echo To remove the service: run UNINSTALL_SERVICE.bat
    echo.
) else (
    echo.
    echo ERROR: Failed to start service!
    echo Check Windows Event Viewer for details.
    echo.
)

pause
