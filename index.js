// Import dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Declare global variables
let departmentNames = [];
let roleTitles = [];
let employeeFullNames = [];

// Create connection to database with mysql2
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "hris_db"
});

// Create cTable function to display all departments
function showDepartments(departmentsArr) {
    console.table("DEPARTMENTS", departmentsArr);
    mainMenu();
}

// Create cTable function to display all roles
function showRoles(rolesArr) {
    console.table("ROLES", rolesArr);
    mainMenu();
}

// Create cTable function to display all employees
function showEmployees(employeesArr) {
    console.table("EMPLOYEES", employeesArr);
    mainMenu();
}

// Create function with a query to select all departments
function queryDepartments(cb) {
    console.log("\n");
    db.promise().query("SELECT * FROM departments;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}

// Create function with a query to select all roles
function queryRoles(cb) {
    console.log("\n");
    db.promise().query("SELECT roles.id, roles.title, departments.name, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}

// Create function with a query to select all employees
function queryEmployees(cb) {
    console.log("\n");
    db.promise().query("SELECT employees.id AS ID, employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Role, departments.name AS Department, roles.salary AS Salary, CONCAT(B.first_name, ' ', B.last_name) AS Manager FROM employees JOIN employees AS B ON employees.manager_id = B.id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id;")
        .then(([rows, fields]) => {
            cb(rows);
        })
        .catch((err) => console.log(err));
}

// Create a function with a query to insert a department using a prepared statement
function addDepartment(dept) {
    db.promise().execute(`INSERT INTO departments (name) VALUES (?);`, [dept])
        .then(() => {
            db.promise().query(`SELECT * FROM departments WHERE name = '${dept}';`)
                .then(([rows, fields]) => {
                    console.log("Department successfully added.\n");
                    console.table(rows);
                    mainMenu();
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create a function with a query to insert a role using a prepared statement
function addRole(role) {
    db.promise().execute(`INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?);`, [role.title, role.department_id, role.salary])
        .then(() => {
            db.promise().query(`SELECT * FROM roles WHERE title = '${role.title}';`)
                .then(([rows, fields]) => {
                    console.log("Role successfully added.\n");
                    console.table(rows);
                    mainMenu();
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create a function with a query to insert an employee using a prepared statement
function addEmployee(employee) {
    db.promise().execute(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [employee.first_name, employee.last_name, employee.role_id, employee.manager_id])
        .then(() => {
            db.promise().query(`SELECT employees.id AS ID, employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Role, departments.name AS Department, roles.salary AS Salary, CONCAT(B.first_name, ' ', B.last_name) AS Manager FROM employees JOIN employees AS B ON employees.manager_id = B.id LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE employees.first_name = '${employee.first_name}' AND employees.last_name = '${employee.last_name}' AND employees.role_id = '${employee.role_id}';`)
                .then(([rows, fields]) => {
                    console.log("Employee successfully added.\n");
                    console.table(rows);
                    mainMenu();
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create function with a query to update an employee's role
function updateRole(empID, roleID, managerID) {
    db.promise().query(`UPDATE employees SET role_id = '${roleID}', manager_id = '${managerID}' WHERE id = '${empID}'`)
        .then(() => {
            db.promise().query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary AS salary, CONCAT(B.first_name, ' ', B.last_name) AS manager FROM employees JOIN employees AS B ON employees.manager_id = B.id LEFT JOIN roles ON employees.role_id = roles.id WHERE employees.id = ${empID}`)
                .then(([rows, fields]) => {
                    console.log("Role successfully updated.\n");
                    console.table(rows);
                    mainMenu();
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create array with an initial question object to select desired action
const mainQuestion = [{
    type: "list",
    name: "menu",
    message: "Please select an action to perform.",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
    when: (answers) => { return answers.menu !== "Exit" },
    loop: true
}];

// Create array with single question for department name to add a department
const newDeptQuestion = [{
    name: "dept",
    message: "Please enter the name of the new department.",
    validate: (answers) => {
        if (/^[A-Za-z0-9]+[A-Za-z0-9\-_\s\,\.\(\)]*$/.test(answers.dept)) {
            return true;
        } else {
            return "Department name requires at least one valid character (letters, numbers, spaces, '-_,.()' and must start with a letter or number."
        }
    }
}];

// Create array with questions for name, salary, and department to add a role
const newRoleQuestions = [{
    name: "title",
    message: "Please enter the name of the new job role.",
    validate: (answers) => {
        if (/^[A-Za-z0-9]+[A-Za-z0-9\-_\s\,\.\(\)]*$/.test(answers.title)) {
            return true;
        } else {
            return "Job title requires at least one valid character (letters, numbers, spaces, '-_,.()' and must start with a letter or number."
        }
    }
}, {
    name: "salary",
    message: "Please enter the salary for this role using only numerals and the decimal point. For example, enter $50,000.00 as 50000 or 50000.00.",
    validate: (answer) => {
        if ((/^[0-9]+$/.test(answer) || /^[0-9]+.[0-9]{2}$/.test(answer)) && answer >= 0 && answer <= 2000000) {
            return true;
        } else {
            return "Please enter a number between 0 and 2,000,000.";
        }
    }
}, {
    type: "list",
    name: "department_id",
    message: "Please select the department to which this role is assigned.",
    choices: departmentNames,
    pageSize: 10
}];

// Create array with questions for first name, last name, role, and manager to add an employee
const newEmployeeQuestions = [{
    name: "first_name",
    message: "Please enter the employee's first name.",
    validate: (answers) => {
        if (/^[A-Za-z]+[a-z\-]*$/.test(answers.first_name)) {
            return true;
        } else {
            return "Please use only letters and hyphens (-).";
        }
    }
}, {
    name: "last_name",
    message: "Please enter the employee's last name.",
    validate: (answers) => {
        if (/^[A-Za-z]+[A-Za-z\-]*$/.test(answers.last_name)) {
            return true;
        } else {
            return "Please use only letters and hyphens (-).";
        }
    }
}, {
    type: "list",
    name: "role_id",
    message: "Please select this employee's job title.",
    choices: roleTitles,
    pageSize: 10
}, {
    type: "list",
    name: "manager_id",
    message: "Please select this employee's manager.",
    when: (answers) => { return answers.role_id !== "President and Chief Executive Officer" },
    choices: employeeFullNames,
    pageSize: 10
}];

// Create array with questions for employee and new role to update an employee's role
const updateEmpRoleQuestions = [{
    type: "list",
    name: "employee",
    message: "Please select an employee to update their role.",
    choices: employeeFullNames,
    pageSize: 10
}, {
    type: "list",
    name: "role",
    message: "Please select the employee's new job role.",
    choices: roleTitles,
    pageSize: 10
}, {
    type: "list",
    name: "manager",
    message: "Please select the employee's new manager.",
    choices: employeeFullNames,
    pageSize: 10
}];

// Create function to get department id from department name
function departmentIDLookup(dept) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM departments WHERE name = '${dept}';`, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].id);
            }
        });
    });
}

// Create function to get role id from role title
function roleIDLookup(title) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM roles WHERE title = '${title}';`, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].id);
            }
        });
    });
}

// Create function to get employee id from employee name and title
function employeeIDLookup(first_name, last_name, role_id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM employees WHERE first_name = '${first_name}' AND last_name = '${last_name}' AND role_id = '${role_id}';`, (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].id);
            }
        });
    });
}

// Create function to parse first_name, last_name, and role from employee string
function parseEmployee(empString) {
    const commaArr = empString.split(", ");
    const nameArr = commaArr[0].split(" ");
    const titleArr = [];
    for (let i = 1; i < commaArr.length; i++) {
        titleArr.push(commaArr[i]);
    }
    const titleStr = titleArr.join(", ");
    return [nameArr[0], nameArr[1], titleStr];
}

// Create function with inquirer prompt to update an employee's role
function promptUpdateEmpRole() {
    db.promise().query("SELECT CONCAT(employees.first_name, ' ', employees.last_name, ', ', roles.title) AS full_name FROM employees JOIN roles ON employees.role_id = roles.id;")
        .then(([rows, fields]) => {
            rows.forEach((row) => employeeFullNames.push(row.full_name));
            db.promise().query("SELECT title FROM roles;")
                .then(([rows, fields]) => {
                    rows.forEach(row => roleTitles.push(row.title));
                    inquirer.prompt(updateEmpRoleQuestions)
                        .then((answers) => {
                            const employee = parseEmployee(answers.employee);
                            roleIDLookup(employee[2])
                                .then((empRoleID) => {
                                    employeeIDLookup(employee[0], employee[1], empRoleID)
                                        .then((empID) => {
                                            roleIDLookup(answers.role)
                                                .then((roleID) => {
                                                    const manager = parseEmployee(answers.manager);
                                                    roleIDLookup(manager[2])
                                                        .then((mgrRoleID) => {
                                                            employeeIDLookup(manager[0], manager[1], mgrRoleID)
                                                                .then((managerID) => {
                                                                    updateRole(empID, roleID, managerID);
                                                                })
                                                                .catch(err => console.log(err));
                                                        })
                                                        .catch((err) => console.log(err));
                                                })
                                                .catch(err => console.log(err));
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        })
                        .catch((err) => {
                            if (err.isTtyError) {
                                console.log("Prompt could not be rendered in the current environment.");
                            } else {
                                console.log(err);
                            }
                        });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create function with inquirer prompt to add an employee
function promptAddEmployee() {
    db.promise().query("SELECT CONCAT(employees.first_name, ' ', employees.last_name, ', ', roles.title) AS full_name FROM employees JOIN roles ON employees.role_id = roles.id;")
        .then(([rows, fields]) => {
            rows.forEach((row) => employeeFullNames.push(row.full_name));
            db.promise().query("SELECT title FROM roles;")
                .then(([rows, fields]) => {
                    rows.forEach(row => roleTitles.push(row.title));
                    inquirer.prompt(newEmployeeQuestions)
                        .then((answers) => {
                            roleIDLookup(answers.role_id)
                                .then((roleID) => {
                                    const manager = parseEmployee(answers.manager_id);
                                    roleIDLookup(manager[2])
                                        .then((mgrRole) => {
                                            employeeIDLookup(manager[0], manager[1], mgrRole)
                                                .then((mgrId) => {
                                                    const newEmployee = {
                                                        first_name: answers.first_name,
                                                        last_name: answers.last_name,
                                                        role_id: roleID,
                                                        manager_id: mgrId
                                                    };
                                                    addEmployee(newEmployee);
                                                })
                                                .catch(err => console.log(err));
                                        })
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
}

// Create function with inquirer prompt to add a role
function promptAddRole() {
    queryDepartments((rows) => {
        rows.forEach((row) => {
            departmentNames.push(row.name);
        });
    });
    inquirer.prompt(newRoleQuestions)
        .then((answers) => {
            departmentIDLookup(answers.department_id)
                .then((dept_id) => {
                    const newRole = {
                        title: answers.title,
                        department_id: dept_id,
                        salary: parseFloat(answers.salary)
                    };
                    addRole(newRole);
                })
                .catch(err => console.log(err));
        })
        .catch((err) => {
            if (err.isTtyError) {
                console.log("Prompt could not be rendered in the current environment.");
            } else {
                console.log(err);
            }
        })
}

// Create function with inquirer prompt to add a department
function promptAddDepartment() {
    inquirer.prompt(newDeptQuestion)
        .then((answer) => {
            addDepartment(answer.dept);
        })
        .catch((err) => {
            if (err.isTtyError) {
                console.log("Prompt could not be rendered in the current environment.");
            } else {
                console.log(err);
            }
        });
}

// Create function with main menu inquirer prompt
function mainMenu() {
    inquirer.prompt(mainQuestion)
        .then((answer) => {
            switch (answer.menu) {
                case "View all departments":
                    queryDepartments(showDepartments);
                    break;
                case "View all roles":
                    queryRoles(showRoles);
                    break;
                case "View all employees":
                    queryEmployees(showEmployees);
                    break;
                case "Add a department":
                    promptAddDepartment();
                    break;
                case "Add a role":
                    promptAddRole();
                    break;
                case "Add an employee":
                    promptAddEmployee();
                    break;
                case "Update an employee role":
                    promptUpdateEmpRole();
                    break;
                case "Exit":
                    process.exit();
            }
        })
        .catch((err) => {
            if (err.isTtyError) {
                console.log("Prompt could not be rendered in the current environment.");
            } else {
                console.log(err);
            }
        });
}

// Call main menu function
mainMenu();