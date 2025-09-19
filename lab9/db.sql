-- Create a new database named 'lab9'
CREATE DATABASE IF NOT EXISTS lab9;

-- Use the 'company' database
USE lab9;

-- Create the 'developers' table
CREATE TABLE `developers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `age` int(11) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert some sample data into the table
INSERT INTO `developers` (`id`, `name`, `gender`, `age`, `designation`, `address`) VALUES
(1, 'John Smith', 'Male', 30, 'Web Developer', '123 Main St, New York'),
(2, 'Jane Doe', 'Female', 28, 'UI/UX Designer', '456 Market St, San Francisco'),
(3, 'Peter Jones', 'Male', 35, 'Project Manager', '789 Oak Ave, Chicago'),
(4, 'Mary Johnson', 'Female', 25, 'Frontend Developer', '321 Pine St, Los Angeles');