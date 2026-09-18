CREATE DATABASE IF NOT EXISTS healthcare_supply_chain;

USE healthcare_supply_chain;

-- SUPPLIERS

CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    ...
);