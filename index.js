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
async function queryDepartments (cb) {
    console.log("\n");
    db.promise().query("SELECT * FROM departments;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}

// Create function with a query to select all roles
async function queryRoles (cb) {
    console.log("\n");
    db.promise().query("SELECT roles.id, roles.title, departments.name, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}

// Create function with a query to select all employees
async function queryEmployees (cb) {
    console.log("\n");
    db.promise().query("SELECT employees.id AS ID, employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Role, departments.name AS Department, roles.salary AS Salary, B.first_name AS ManagerFirst, B.last_name AS ManagerLast FROM employees JOIN employees AS B ON employees.manager_id = B.id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}
queryEmployees(showEmployees);
// Create a function with a query to insert a department using a prepared statement
async function addDepartment (dept) {

}

// Create a function with a query to insert a role using a prepared statement

// Create a function with a query to insert an employee using a prepared statement

// Create function with a query to update an employee's role
async function updateRole(empID, roleID) {
    db.promise().query(`UPDATE employees SET role_id = ${roleID} WHERE id = ${empID}`)
        .then(([rows, fields]) => {
            db.promise().query(`SELECT * FROM employees WHERE id = ${empID}`)
                .then(([rows, fields]) => {
                    console.log("Role successfully updated.\n");
                    console.table(rows);
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}


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
