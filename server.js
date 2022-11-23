const mysql = require('mysql2');
const inquirer = require('inquirer');

    const db = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'rootroot',
            database: 'employee_db'
        }
    );

const question = 
[{
    type: 'list',
    name: 'choice',
    Message:'Where would you like to go?',
    choices: ['View departments', 'View roles', 'View employees',
            'Add a department', 'Add a role', 'Add an employee', 'Update employees role',
            'exit']
}]
function verify() {
    inquirer
        .prompt(question)
            .then((answer) => {
            switch (answer.choice) {
            case 'View departments':
              viewDepartments();
              break;

            case 'View roles':
              viewRoles();
              break;

            case 'View employees':
              viewEmployees();
              break;

            case 'Add a department':
              addDepartment();
              break;
            
            case 'Add a role':
              addRole();
              break;

            case 'Add an employee':
              addEmployee();
              break;
            
            case 'Update employees role':
              updateRole();
              break;

            case 'exit':
              process.exit(0);
          }
        })
}
function viewDepartments() {
    const sql = `SELECT department_id AS ID, department_name AS Department FROM department`;
        db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        verify();
    })
}
function viewRoles() {
    const sql = `SELECT roles.role_id AS ID, roles.title AS Title, department.department_name AS Department, roles.salary 
    FROM roles
    JOIN department ON roles.department_id = department.department_id 
    ORDER BY roles.role_id ASC`
        db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        verify();
    })
}
function viewEmployees() {
    const sql = `SELECT e.employee_id AS ID, e.first_name AS "First Name", e.last_name AS "Last Name", 
    r.title AS "Title", d.department_name AS "Department", 
    r.salary AS "Salary"
    FROM employee e
    LEFT JOIN roles r ON r.role_id = e.role_id 
    LEFT JOIN department d ON d.department_id = r.department_id`
        db.query(sql, (err, data) => {
        if (err) throw err;
        console.table(data);
        verify();
    })
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name:'new_department',
        message:'What is the departments name?'
      }
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(department_name) 
      VALUE ("${answer.new_department}");`
      db.query(sql, (err, data) => {
        if (err) throw err;
        console.log(`department ${answer.new_department} added to the database!`);
        verify();
      })

    })
}

function addRole() {
  db.query('SELECT * FROM department;', (err, data) => {
    if (err) throw err;
    const choices = data.map(department => department.department_name);
    inquirer
    .prompt([
      {
        type:'input',
        name: 'role_name',
        message: 'What is the name of the role?'
      },
      {
        type: 'list',
        name:'department',
        message: 'Which department would you like to assign the role to?',
        choices: choices
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary?'
      }
    ])
    .then((answer) => {
      const sql = `INSERT INTO roles(title, salary, department_id)
      VALUES ("${answer.role_name}", ${answer.salary}, (SELECT department_id FROM department WHERE department_name = "${answer.department}"));`
      db.query(sql, (err, data) => {
        if (err) throw err;
        console.log(`role ${answer.role_name} has been added!`);
        verify();
      })
    })
  })
}

function addEmployee() {
  db.query('SELECT * FROM roles', (err, role) => {
    if (err) throw err;
    const roles = role.map(role => role.title);
    db.query('SELECT first_name, last_name FROM employee', (err, employee) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: `What is employee's first name?`
          },
          {
            type: 'input',
            name: 'last_name',
            message: `What is employee's last name?`
          },
          {
            type: 'list',
            name: 'role',
            choices: roles,
          }
        ])
        .then((answer) => {
            const sql = `INSERT INTO employee(first_name, last_name, role_id)
            VALUES
                ("${answer.first_name}", "${answer.last_name}",
                (SELECT role_id FROM roles WHERE title = "${answer.role}"));`
             db.query(sql, (err, data) => {
                if (err) throw err;
                console.log(`"${answer.first_name}" has been added to employee table!`);
                verify();
              })
        })
    })
  })
}
function updateRole() { 
  db.query('SELECT * FROM roles', (err, role) => {
    if (err) throw err;
    const roles = role.map(role => ({ name: role.title, value: role.role_id }));
    db.query('SELECT * FROM employee', (err, data) => {
      if (err) throw err;
      const employee = data.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value:employee.employee_id}));
      console.log(employee);
      inquirer
          .prompt([
            {
              type: 'list',
              name: 'name_check',
              message: `Which employee's role do you want to update?`,
              choices: employee
            },
            {
              type: 'list',
              name: 'new_role',
              message: 'What is the employees new role?',
              choices: roles
            }
          ])
          .then((answer) => {
            const index = answer.name_check - 1;
            const sql = `UPDATE employee SET role_id = ${answer.new_role} WHERE employee_id = ${employee[index].value};`;
            console.log(sql);
            db.query(sql, (err,data) => {
              if (err) throw err;
              console.log('You have updated the role!');
              verify();
            })
          })
      })
  })
};
verify()