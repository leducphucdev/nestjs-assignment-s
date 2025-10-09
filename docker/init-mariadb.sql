-- MariaDB initialization script for NestJS Assignment
-- This script creates users and grants privileges for different environments

-- Create development user
CREATE USER IF NOT EXISTS 'nestjs_assignment_development'@'localhost' IDENTIFIED BY 'nestjs_assignment_development';
CREATE USER IF NOT EXISTS 'nestjs_assignment_development'@'%' IDENTIFIED BY 'nestjs_assignment_development';

-- Create production user
CREATE USER IF NOT EXISTS 'nestjs_assignment_production'@'localhost' IDENTIFIED BY 'nestjs_assignment_production';
CREATE USER IF NOT EXISTS 'nestjs_assignment_production'@'%' IDENTIFIED BY 'nestjs_assignment_production';

-- Create test user
CREATE USER IF NOT EXISTS 'nestjs_assignment_test'@'localhost' IDENTIFIED BY 'nestjs_assignment_test';
CREATE USER IF NOT EXISTS 'nestjs_assignment_test'@'%' IDENTIFIED BY 'nestjs_assignment_test';

-- Create databases for each environment
CREATE DATABASE IF NOT EXISTS nestjs_assignment_development;
CREATE DATABASE IF NOT EXISTS nestjs_assignment_production;
CREATE DATABASE IF NOT EXISTS nestjs_assignment_test;

-- Grant privileges to development user
GRANT ALL PRIVILEGES ON nestjs_assignment_development.* TO 'nestjs_assignment_development'@'localhost';
GRANT ALL PRIVILEGES ON nestjs_assignment_development.* TO 'nestjs_assignment_development'@'%';

-- Grant privileges to production user
GRANT ALL PRIVILEGES ON nestjs_assignment_production.* TO 'nestjs_assignment_production'@'localhost';
GRANT ALL PRIVILEGES ON nestjs_assignment_production.* TO 'nestjs_assignment_production'@'%';

-- Grant privileges to test user
GRANT ALL PRIVILEGES ON nestjs_assignment_test.* TO 'nestjs_assignment_test'@'localhost';
GRANT ALL PRIVILEGES ON nestjs_assignment_test.* TO 'nestjs_assignment_test'@'%';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Show created users and databases
SELECT User, Host FROM mysql.user WHERE User LIKE 'nestjs_assignment_%';
SHOW DATABASES LIKE 'nestjs_assignment_%';
