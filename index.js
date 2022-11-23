const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_db'
});

module.exports = db;

const question = [{
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['view all departments','view all roles','view all employees','add a department','add a role','add an employee','update an employee role'],
        }]

    function checkStatus() {
        inquirer
            .prompt(question)
            .then((answer) => {
                switch (answer.choice) {
                    case 'view all departments':
                        viewAllDepartments();
                        break;
                    
                    case 'view all roles':
                        viewAllRoles();
                        break;

                    case 'view all employees':
                        viewAllEmployees();
                        break;
                    
                    case 'add a department':
                        addADepartment();
                        break;

                     case 'add a role':
                        addARole();
                        break;
                        
                    case 'add a employee':
                        addAEmployee();
                        break;

                    case 'update an employee':
                        updateEmployee();
                         break;

                    case 'quit':
                        console.log('Exit!');
                        process.exit(0);

                    
                }
            })
    }

    // view available departments in database

    function viewAllDepartments() {
        const sql = `SELECT department_id AS ID, department_name AS Department FROM department`;

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.table(data);
            checkStatus();
        })
    }

     // view available roles in database

    function viewAllRoles() {
        const sql = `SELECT roles.role_id AS ID, roles.title AS Title, department.department_name As Department, roles.salary FROM roles
        JOIN department ON roles.department_id = department.department_id
        ORDER BY roles.role_id ASC`

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.table(data);
            checkStatus();
        })
    }

    //view all employees in database        

    function viewAllEmployees() {
        const sql = `SELECT e.employee_id AS ID, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Title", d.department_name AS "Department", 
        r.salary AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
        FROM employee e
        LEFT JOIN roles r ON r.role_id = e.role_id 
        LEFT JOIN department d ON d.department_id = r.department_id
        LEFT JOIN employee m ON m.manager_id = e.manager_id
        ORDER BY e.employee_id ASC;`

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.table(data);
            checkStatus();
        })
    }

    //add a department to the database

    function addADepartment() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'Department',
                    message: 'Please type the name of the department you would like to add:'
                }
            ])
            .then((answer) => {
                const sql = `INSERT INTO department(department_name) VALUE ("${answer.Department}");`
                db.query(sql, (err, data) => {
                    if (err) throw err;
                    console.log(`${answer.Department} added to the database.`);
                    checkStatus()
                })

            })
    }

    // add a role to the database

    function addARole() {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'Please type the name of the role you would like to add:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the yearly salary of the role?'
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'What department is this role a part of?'
                }
            ])
            .then((answer) => {
                const sql = `INSERT INTO roles(title, salary, department_id) VALUES ("${answer.role}", ${answer.salary}, (SELECT department_id FROM department WHERE department_name = "${answer.department}"));`
                db.query(sql, (err, data) => {
                    if (err) throw err;
                    console.log(`"${answer.role}" has been added to the roles section of the database!`);
                    checkStatus();
                })
            })
    }

    //add an employee to the database

    function addAEmployee () {
        db.query('SELECT * FROM roles', (err, role) => {
            if (err) throw err;
            const roles = role.map(role => role.title);
            db.query('SELECT first_name, last_name FROM employee', (err, employee) => {
                if (err) throw err;
                //const possibleManager = employee.map(employeee => (employee.first_name + ' ' + employee.last_name));
                //possibleManager.push('Null');

                inquirer
                    .prompt ([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'What is the employees first_name?'
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'What is the employees last_name?'
                        }
                    ])
                    .then ((answer => {
                        const sql = `INSERT INTO employee(first_name, last_name, role_id) VALUES ("${answer.first_name}", "${answer.last_name}", (SELECT role_id FROM roles WHERE title = "${answer.role}"));`
                        db.query(sql, (err, data) => {
                            if (err) throw err;
                            console.log(`${answer.first_name} + ${answer.last_name} has been added to the database!`);
                            checkStatus()
                        })
                    }))
            })
        })
    }

    