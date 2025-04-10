-- Create database if it doesn't exist
IF DB_ID('EnterpriseLFSDB') IS NULL
BEGIN
    CREATE DATABASE [EnterpriseLFSDB];
    PRINT 'Database EnterpriseLFSDB created.';
END
ELSE
BEGIN
    PRINT 'Database EnterpriseLFSDB already exists.';
END
GO

-- Create login if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'admin')
BEGIN
    CREATE LOGIN [admin] WITH PASSWORD = 'Luxury@Fragrance';
    PRINT 'Login admin created.';
END
ELSE
BEGIN
    PRINT 'Login admin already exists.';
END
GO

-- Use the database
USE [EnterpriseLFSDB];
GO

-- Create database user for the login if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'admin')
BEGIN
    CREATE USER [admin] FOR LOGIN [admin];
    PRINT 'Database user admin created.';
END
ELSE
BEGIN
    PRINT 'Database user admin already exists.';
END
GO

-- Grant permissions to the user
GRANT CONNECT TO [admin];
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE TO [admin];
PRINT 'Permissions granted to admin user.';
GO

-- Add user to db_owner role for full access
EXEC sp_addrolemember 'db_owner', 'admin';
PRINT 'Admin user added to db_owner role.';
GO
