DROP DATABASE IF EXISTS hris_db;
CREATE DATABASE hris_db;

USE hris_db;

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(80) NOT NULL,
    department_id INT NOT NULL,
    salary DECIMAL NOT NULL,
    CHECK (salary <= 2000000),
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
);

ALTER TABLE roles AUTO_INCREMENT=200;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id),
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
);

ALTER TABLE employees AUTO_INCREMENT=1000;

SHOW COLUMNS FROM departments;
SHOW COLUMNS FROM roles;
SHOW COLUMNS FROM employees;