-- Salon Software Database Schema for MSSQL
-- Run this script to create the database structure

-- Create Database (if needed)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SalonSoftwareDB')
BEGIN
    CREATE DATABASE SalonSoftwareDB;
END
GO

USE SalonSoftwareDB;
GO

-- Note: Entity Framework will create the Identity tables and other tables automatically
-- This script is provided as a reference for the database structure

-- After running the application with migrations, the following tables will be created:
-- AspNetUsers, AspNetRoles, AspNetUserRoles, AspNetUserClaims, AspNetRoleClaims
-- Staff, Services, Products, Invoices, InvoiceServices, InvoiceProducts, Payments, SalonSettings

-- To apply migrations, run these commands in the backend directory:
-- dotnet ef migrations add InitialCreate
-- dotnet ef database update

-- For manual table creation (if not using EF migrations):

-- Staff Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Staff]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Staff] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [Name] NVARCHAR(200) NOT NULL,
        [Phone] NVARCHAR(20) NULL,
        [Active] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Services Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Services]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Services] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [Name] NVARCHAR(200) NOT NULL,
        [BasePrice] DECIMAL(10,2) NOT NULL,
        [Active] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Products Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Products] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [Name] NVARCHAR(200) NOT NULL,
        [Price] DECIMAL(10,2) NOT NULL,
        [StockQuantity] INT NOT NULL DEFAULT 0,
        [Active] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Invoices Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Invoices]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Invoices] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [InvoiceNumber] NVARCHAR(50) NOT NULL UNIQUE,
        [ClientName] NVARCHAR(200) NOT NULL,
        [ClientPhone] NVARCHAR(20) NOT NULL,
        [InvoiceDate] DATE NOT NULL DEFAULT CAST(GETUTCDATE() AS DATE),
        [Subtotal] DECIMAL(10,2) NOT NULL DEFAULT 0,
        [TotalAmount] DECIMAL(10,2) NOT NULL,
        [CreatedBy] NVARCHAR(450) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- InvoiceServices Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceServices]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[InvoiceServices] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [InvoiceId] UNIQUEIDENTIFIER NOT NULL,
        [ServiceId] UNIQUEIDENTIFIER NOT NULL,
        [StaffId] UNIQUEIDENTIFIER NULL,
        [BasePrice] DECIMAL(10,2) NOT NULL,
        [DiscountPercent] DECIMAL(5,2) NOT NULL DEFAULT 0,
        [FinalPrice] DECIMAL(10,2) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices]([Id]) ON DELETE CASCADE,
        FOREIGN KEY ([ServiceId]) REFERENCES [Services]([Id]),
        FOREIGN KEY ([StaffId]) REFERENCES [Staff]([Id])
    );
END
GO

-- InvoiceProducts Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[InvoiceProducts]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[InvoiceProducts] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [InvoiceId] UNIQUEIDENTIFIER NOT NULL,
        [ProductId] UNIQUEIDENTIFIER NOT NULL,
        [Quantity] INT NOT NULL,
        [UnitPrice] DECIMAL(10,2) NOT NULL,
        [TotalPrice] DECIMAL(10,2) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices]([Id]) ON DELETE CASCADE,
        FOREIGN KEY ([ProductId]) REFERENCES [Products]([Id])
    );
END
GO

-- Payments Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Payments] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [InvoiceId] UNIQUEIDENTIFIER NOT NULL,
        [PaymentMode] NVARCHAR(50) NOT NULL,
        [Amount] DECIMAL(10,2) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices]([Id]) ON DELETE CASCADE
    );
END
GO

-- SalonSettings Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SalonSettings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SalonSettings] (
        [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [SalonName] NVARCHAR(200) NOT NULL DEFAULT 'Elegant Salon',
        [BranchAddress] NVARCHAR(500) NOT NULL DEFAULT '123 Beauty Street',
        [Phone] NVARCHAR(20) NULL,
        [Email] NVARCHAR(100) NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    -- Insert default settings
    INSERT INTO [SalonSettings] ([SalonName], [BranchAddress])
    VALUES ('Elegant Salon', '123 Beauty Street, City');
END
GO

PRINT 'Database schema created successfully!';
GO
