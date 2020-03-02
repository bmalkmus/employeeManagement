const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require ('mysql');


var connection = mysql.createConnection({
    host : 'localhost',
    port: 3306,
    user: 'root',
    password: 'Password',
    database: 'employee_db'
})

connection.connect(function(err) {
    if (err) throw err;
    runSearch();
  });

  function runSearch () {
      inquirer.prompt({
          name: 'action',
          type: 'list',
          message: 'How can I assist you?',
          choices: [
              'View all employees',
              'View all employees by department',
              'View all employees by manager',
              'Add an employee',
              'Remove an employee',
              "Update an employee's role",
              "Update an employee's manager",
              'Add Department',
              'Add role',
              'Remove department',
              'Remove role',
              'View a Department Budget'
            
          ]
      })
      .then(function(answer){
          switch(answer.action) {

                case 'View all employees':
                    allEmployees();
                    // console.log('All Employee')
                    break;

                case 'View all employees by department':
                    // allDept();
                    console.log('Department Employees')
                    break;

                case 'View all employees by manager':
                    // allManager();
                    console.log('Manager Employees')
                    break;

                case 'Add an employee':
                    // addEmploy();
                    console.log('Employee Added')
                    break;
                
                case 'Remove an employee':
                    // removeEmploy();
                    console.log('Employee Removed')
                    break;

                case "Update an employee's role":
                    // updateRole();
                    console.log("Role updated")
                    break;

                case "Update an employee's manager":
                    // updateManager();
                    console.log('Manager udated');
                    break;

                case 'Add Department':
                    addDept();
                    // console.log('Department added');
                    break;

                case 'Add role':
                    // addRole();
                    console.log('Role Added')
                    break;

                case 'Remove department':
                    // removeDept();
                    console.log('Department Added')
                    break;

                case 'Remove role':
                    // removeRole();
                    console.log('Role Removed');
                    break;

                case 'View a Department Budget':
                    // deptBudge();
                    console.log('There is no budget!')
                    break;

          }
      })   
  }

  function allEmployees (){
    connection.query('Select * from employee', function(err, res) {
        if (err) throw err;
        console.table('this is my table information');
        runSearch();
    })
  }

  function addDept() {
      inquirer.prompt({
          name: 'department',
          type: 'input',
          message: "What is the new Department's name?"
      })
      .then(function(answer){
          let query = `INSERT INTO department(name) VALUES (${answer.department})`

          connection.query(query, function(err, res) {
            if (err) throw err;
            console.log('department added');
            })
            
            connection.query('Select * FROM department', function (err, res){
                if (err) throw (err);
                console.table(res);
                runSearch();
            })
      })
  }



