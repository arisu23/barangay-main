DATABASE STRUCTURE

CREATE DATABASE IF NOT EXISTS barangay_bis;
USE barangay_bis;
 
CREATE TABLE IF NOT EXISTS residents (
id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR(100) NOT NULL,
middle_name VARCHAR(100),0
dob DATE,
gender ENUM('Male','Female','Other'),
civil_status VARCHAR(50),
place_of_birth VARCHAR(200),
address VARCHAR(255),
household_no VARCHAR(50),
phone VARCHAR(50),
email VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 
 
CREATE DATABASE barangay_bis;
USE barangay_bis;
 
CREATE TABLE residents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  middle_name VARCHAR(50),
  last_name VARCHAR(50),
  dob DATE,
  gender VARCHAR(10),
  civil_status VARCHAR(20),
  place_of_birth VARCHAR(100),
  address VARCHAR(150),
  household_no VARCHAR(50),
  phone VARCHAR(30),
  email VARCHAR(50)
);
 
 
 
CREATE TABLE incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(100) NOT NULL,
  persons_involved TEXT,
  resolution_status ENUM('Settled', 'Referred', 'Ongoing') DEFAULT 'Ongoing',
  mediation_records TEXT,
  outcome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
 
 
CREATE TABLE households (
  id INT AUTO_INCREMENT PRIMARY KEY,
  household_no VARCHAR(50) NOT NULL,
  head_of_family VARCHAR(100) NOT NULL,
  members TEXT,
  socio_economic_classification VARCHAR(100),
  senior_citizens INT DEFAULT 0,
  pwds INT DEFAULT 0,
  solo_parents INT DEFAULT 0,
  indigents INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
 
 
ALTER TABLE residents ADD COLUMN photo VARCHAR(255);

