-- ============================================
-- Salon Software - Seed Initial Data
-- Version: 1.0.0
-- ============================================

USE SalonDB;
GO

PRINT 'Starting data seeding...';
GO

-- Seed Admin Role
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'Admin')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (NEWID(), 'Admin', 'ADMIN', NEWID());
    PRINT 'Admin role created.';
END
GO

-- Seed Staff Role
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'Staff')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (NEWID(), 'Staff', 'STAFF', NEWID());
    PRINT 'Staff role created.';
END
GO

-- Seed Default Admin User
-- Password: Admin@123 (pre-hashed)
DECLARE @AdminRoleId NVARCHAR(450) = (SELECT TOP 1 Id FROM AspNetRoles WHERE Name = 'Admin');
DECLARE @AdminUserId NVARCHAR(450) = NEWID();

IF NOT EXISTS (SELECT 1 FROM AspNetUsers WHERE Email = 'admin@salon.com')
BEGIN
    INSERT INTO AspNetUsers (
        Id, UserName, NormalizedUserName, Email, NormalizedEmail, 
        EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp,
        PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount,
        FullName
    )
    VALUES (
        @AdminUserId,
        'admin@salon.com',
        'ADMIN@SALON.COM',
        'admin@salon.com',
        'ADMIN@SALON.COM',
        1, -- Email confirmed
        'AQAAAAIAAYagAAAAELqVzKJ3fFZvL5Bk7xKp6wF8V+HYvQGz9jC3nP5mR8sT4wD6xA7yE2kL1vN9hM0pQ==', -- Admin@123
        NEWID(),
        NEWID(),
        0, -- Phone not confirmed
        0, -- 2FA disabled
        1, -- Lockout enabled
        0, -- No failed attempts
        'System Administrator'
    );
    
    -- Assign Admin role to user
    INSERT INTO AspNetUserRoles (UserId, RoleId)
    VALUES (@AdminUserId, @AdminRoleId);
    
    PRINT 'Default admin user created: admin@salon.com / Admin@123';
END
ELSE
BEGIN
    PRINT 'Admin user already exists.';
END
GO

-- Seed Sample Services (Optional)
IF NOT EXISTS (SELECT 1 FROM Services)
BEGIN
    INSERT INTO Services (Id, Name, BasePrice, Duration, Active, CreatedAt)
    VALUES 
        (NEWID(), 'Haircut - Men', 150.00, 30, 1, GETDATE()),
        (NEWID(), 'Haircut - Women', 250.00, 45, 1, GETDATE()),
        (NEWID(), 'Hair Coloring', 800.00, 120, 1, GETDATE()),
        (NEWID(), 'Facial - Basic', 300.00, 45, 1, GETDATE()),
        (NEWID(), 'Facial - Premium', 500.00, 60, 1, GETDATE()),
        (NEWID(), 'Manicure', 200.00, 30, 1, GETDATE()),
        (NEWID(), 'Pedicure', 250.00, 45, 1, GETDATE()),
        (NEWID(), 'Hair Spa', 600.00, 90, 1, GETDATE()),
        (NEWID(), 'Bridal Makeup', 5000.00, 180, 1, GETDATE()),
        (NEWID(), 'Waxing - Full Body', 800.00, 60, 1, GETDATE());
    
    PRINT '10 sample services added.';
END
GO

-- Seed Sample Products (Optional)
IF NOT EXISTS (SELECT 1 FROM Products)
BEGIN
    INSERT INTO Products (Id, Name, Category, UnitPrice, StockQuantity, Active, CreatedAt)
    VALUES 
        (NEWID(), 'Hair Oil - 100ml', 'Hair Care', 150.00, 50, 1, GETDATE()),
        (NEWID(), 'Shampoo - 200ml', 'Hair Care', 250.00, 40, 1, GETDATE()),
        (NEWID(), 'Conditioner - 200ml', 'Hair Care', 280.00, 35, 1, GETDATE()),
        (NEWID(), 'Face Cream - 50g', 'Skin Care', 350.00, 30, 1, GETDATE()),
        (NEWID(), 'Face Wash - 100ml', 'Skin Care', 180.00, 45, 1, GETDATE()),
        (NEWID(), 'Moisturizer - 100ml', 'Skin Care', 400.00, 25, 1, GETDATE()),
        (NEWID(), 'Nail Polish', 'Cosmetics', 80.00, 60, 1, GETDATE()),
        (NEWID(), 'Lipstick', 'Cosmetics', 200.00, 40, 1, GETDATE()),
        (NEWID(), 'Hair Serum - 50ml', 'Hair Care', 320.00, 30, 1, GETDATE()),
        (NEWID(), 'Body Lotion - 200ml', 'Skin Care', 280.00, 35, 1, GETDATE());
    
    PRINT '10 sample products added.';
END
GO

-- Seed Salon Settings
IF NOT EXISTS (SELECT 1 FROM SalonSettings)
BEGIN
    INSERT INTO SalonSettings (Id, SalonName, BranchAddress, PhoneNumber, Email, GSTNumber, CreatedAt, UpdatedAt)
    VALUES (
        NEWID(),
        'Cheap&Best Salon',
        '123 Beauty Street, City, State - 123456',
        '9876543210',
        'info@cheapandbestsalon.com',
        '29XXXXX1234X1Z5',
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Default salon settings created.';
END
GO

PRINT 'Data seeding completed successfully!';
PRINT '';
PRINT '============================================';
PRINT 'Default Credentials:';
PRINT '  Email: admin@salon.com';
PRINT '  Password: Admin@123';
PRINT '============================================';
GO
