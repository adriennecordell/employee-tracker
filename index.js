const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'employee_db'
});

//module.exports = db;

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
        const sql = `SELECT department_id AS id, department AS Department FROM department`;

        db.query(sql, (err, data) => {
            if (err) throw err;
            console.table(data);
            checkStatus();
        })
    }

    function viewAllRoles() {
        const sql = `SELECT `
    }

    