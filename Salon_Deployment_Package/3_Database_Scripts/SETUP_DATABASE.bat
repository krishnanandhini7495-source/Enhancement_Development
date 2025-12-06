@echo off
REM ============================================
REM Salon Software - Automatic Database Setup
REM ============================================

echo.
echo ================================================
echo   Salon Software - Database Setup
echo ================================================
echo.

REM Get SQL Server instance name
set /p SQLSERVER="Enter SQL Server instance (default: localhost\SQLEXPRESS): "
if "%SQLSERVER%"=="" set SQLSERVER=localhost\SQLEXPRESS

echo.
echo Connecting to SQL Server: %SQLSERVER%
echo.

REM Step 1: Create Database
echo [Step 1/3] Creating SalonDB database...
sqlcmd -S %SQLSERVER% -E -i "1_CreateDatabase.sql" -o "setup_log.txt"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database. Check setup_log.txt for details.
    pause
    exit /b 1
)
echo Database created successfully!

REM Step 2: Create Tables and Schema
echo.
echo [Step 2/3] Creating tables and schema...
sqlcmd -S %SQLSERVER% -d SalonDB -E -i "2_CreateTables.sql" -o "setup_log.txt"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create tables. Check setup_log.txt for details.
    pause
    exit /b 1
)
echo Tables created successfully!

REM Step 3: Seed Initial Data
echo.
echo [Step 3/3] Seeding initial data...
sqlcmd -S %SQLSERVER% -d SalonDB -E -i "3_SeedData.sql" -o "setup_log.txt"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to seed data. Check setup_log.txt for details.
    pause
    exit /b 1
)
echo Data seeded successfully!

echo.
echo ================================================
echo   Database Setup Complete!
echo ================================================
echo.
echo Default Admin Credentials:
echo   Email: admin@salon.com
echo   Password: Admin@123
echo.
echo Connection String:
echo   Server=%SQLSERVER%;Database=SalonDB;Integrated Security=true;TrustServerCertificate=true;
echo.
echo Check setup_log.txt for detailed execution log.
echo.
pause
