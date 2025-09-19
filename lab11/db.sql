-- 1. Create a new database
CREATE DATABASE IF NOT EXISTS `lab11`;

-- 2. Use the new database
USE `lab11`;

-- 3. Create the 'users' table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Insert some sample data
INSERT INTO `users` (`name`, `email`, `phone`) VALUES
('Alice Johnson', 'alice.j@example.com', '123-456-7890'),
('Bob Williams', 'bob.w@example.com', '234-567-8901'),
('Charlie Brown', 'charlie.b@example.com', '345-678-9012');