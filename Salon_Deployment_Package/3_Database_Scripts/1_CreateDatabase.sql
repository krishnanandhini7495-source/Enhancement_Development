-- ============================================
-- Salon Software - Database Creation Script
-- Version: 1.0.0
-- ============================================

USE master;
GO

-- Drop database if exists (CAUTION: Only for fresh install)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SalonDB')
BEGIN
    ALTER DATABASE SalonDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SalonDB;
    PRINT 'Existing SalonDB database dropped.';
END
GO

-- Create new database
CREATE DATABASE SalonDB;
GO

PRINT 'SalonDB database created successfully!';
GO

USE SalonDB;
GO

PRINT 'Database creation complete. Run migrations using dotnet ef database update.';
GO
