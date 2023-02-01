// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Create connection to database with mysql2
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "hris_db"
});

// Create cTable function to display all departments
function showDepartments (departmentsArr) {
    console.table("DEPARTMENTS", departmentsArr);
}

// Create cTable function to display all roles
function showRoles (rolesArr) {
    console.table("ROLES", rolesArr);
}

// Create cTable function to display all employees
function showEmployees (employeesArr) {
    console.table("EMPLOYEES", employeesArr);
}

// Create function with a query to select all departments

// Create function with a query to select all roles

// Create function with a query to select all employees

// Create function with a query to update an employee's role

// Create array with an initial question object to select desired action

// Create array with single question for department name to add a department

// Create array with questions for name, salary, and department to add a role

// Create array with questions for first name, last name, role, and manager to add an employee

// Create array with questions for employee and new role to update an employee's role

// Create function with inquirer prompt to update an employee's role

// Create function with inquirer prompt to add an employee

// Create function with inquirer prompt to add a role

// Create function with inquirer prompt to add a department

// Create function with main menu inquirer prompt

// Call main menu function
