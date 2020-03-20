const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require ('mysql');
require('dotenv').config();

let ident;
let employeeID;
let roleID;
let managerID;


var connection = mysql.createConnection({
    host : 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'employee_db'
})

connection.connect(function(err) {
    if (err) throw err;
    console.log (`connected as id ${connection.threadID}`);
    runSearch();
  });

  function runSearch () {
      inquirer.prompt({
          name: 'action',
          type: 'list',
          message: 'How can I assist you?',
          choices: [
              'View all Employees',
              'View all Employees by Department',
              'Add an Employee',
              'Remove an Employee',
              "Update an Employee's Role",
              "Update an Employee's Manager",
              'Add Department',
              'Add Role',
              'Remove Department',
              'Remove Role',
              'View a Department Budget',
              "Exit"
            
          ]
      })
      .then(function(answer){
          switch(answer.action) {

                case 'View all Employees':
                    allEmployees();
                    break;

                case 'View all Employees by Department':
                    allDept();
                    break;

                case 'Add an Employee':
                    addEmploy();
                    break;
                
                case 'Remove an Employee':
                    removeEmploy();
                    break;

                case "Update an Employee's Role":
                    updateRole();
                    break;

                case "Update an Employee's Manager":
                    updateManager();
                    break;

                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Remove Department':
                    removeDept();
                    break;

                case 'Remove Role':
                    removeRole();
                    break;

                case 'View a Department Budget':
                    deptBudge();
                    break;
                case 'Exit':
                    connection.end();
                    break

          }
      })  
     
  }


function deptBudge() {
    let table = [] 
    let budget = [] 
      connection.query('Select * FROM department', function (err, result){
          if (err) {
              console.log('no data available');
              runSearch();
          };
          let names = result;
          inquirer.prompt([
             {
                 name: 'departments',
                 type: 'list',
                 message: 'What department would you like to see?',
                 choices: names
             }
     ])
            .then(function(answer){
                connection.query(`SELECT e.id, first_name, last_name, title, name AS department, salary, manager_id
                    FROM role r, department d, employee e WHERE r.department_id = d.id and  e.role_id = r.id`, function(err, res) {
                        if (err) throw err;
                        for (i = 0; i <res.length; i++){
                                if (res[i].department === answer.departments){
                                table.push(res[i]);
                                budget.push(res[i].salary);

                            }
                        }
                        if (i = res.length - 1){
                            console.log('-------------------------------')
                            console.table(table);
                            console.log("Your Budget for this department is $" +
                                budget.reduce((a, b) => a + b, 0)
                              )

                            console.log('------------------------------')
                            runSearch();
                        }
                })
            })                   
        })
}

function updateManager () {
    let employees = [];
    let manager = ['None'];
    connection.query('Select employee.id as EmployID, manager_id, CONCAT (employee.first_name, " ", employee.last_name) as fullname FROM  employee',
    function (err, res){
        if (err) {
            console.log('no data available');
            runSearch();
        };
       for (i = 0; i < res.length; i++){
           employees.push(res[i].fullname);
           manager.push(res[i].fullname);
           employees = [...new Set(employees)];
       }
       inquirer.prompt ( [
               {
                   name: 'name',
                   type: 'list',
                   message: 'What is the name of the employee?',
                   choices: employees
               }, 
               {
                   name: 'manager',
                   type: 'list',
                   message: 'Who is the new manager of the employee?',
                   choices: manager
               }
           ])
           .then(function(answer){
               for (i = 0; i < res.length; i ++){
                   if (answer.manager === "None"){
                       managerID = NULL;
                   }
                   if (answer.manager === res[i].fullname){
                       managerID = res[i].EmployID
                   };
                   if (answer.name === res[i].fullname){
                       employeeID = res[i].EmployID
                   }

               }
                   connection.query(`Update employee SET manager_id = ${managerID} WHERE employee.id = ${employeeID}`, function (err, result){
                       if (err) throw (err);
                       console.log ('Manager is updated!');
                       allEmployees();
                   })
}) 
    })
}

 function updateRole(){
     let employees = [];
     let roles =[];
     connection.query('Select employee.id as EmployID, role.title, role.id as roleID, CONCAT (employee.first_name, " ", employee.last_name) as fullname FROM role, employee',
     function (err, res){
         console.log(res);
        if (err) {
            console.log('no data available');
            runSearch();
        };
        for (i = 0; i < res.length; i++){
            employees.push(res[i].fullname);
            roles.push(res[i].title);
            employees = [...new Set(employees)];
            roles = [...new Set(roles)];
        }
        inquirer.prompt ( [
                {
                    name: 'name',
                    type: 'list',
                    message: 'What is the name of the employee?',
                    choices: employees
                }, 
                {
                    name: 'role',
                    type: 'list',
                    message: 'What is the new role of the employee?',
                    choices: roles
                }
            ])
            .then(function(answer){
                for (i = 0; i < res.length; i ++){
                    if (answer.role === res[i].title){
                        roleID = res[i].roleID
                    };
                    if (answer.name === res[i].fullname){
                        employeeID = res[i].EmployID
                    }

                }
                    connection.query(`Update employee SET role_id = ${roleID} WHERE employee.id = ${employeeID}`, function (err, result){
                        if (err) throw (err);
                        console.log ('Role is updated!');
                        allEmployees();
                    })
}) 
     })
}

function allDept(){
      let table = []  
      connection.query('Select * FROM department', function (err, result){
        if (err) {
            console.log('no data available');
            runSearch();
        };
          let names = result;
          inquirer.prompt([
             {
                 name: 'departments',
                 type: 'list',
                 message: 'What department would you like to see?',
                 choices: names
             }
    
            ])
            .then(function(answer){
                connection.query(`SELECT e.id, first_name, last_name, title, name AS department, salary, manager_id
                    FROM role r, department d, employee e WHERE r.department_id = d.id and  e.role_id = r.id`, function(err, res) {
                        if (err) {
                            console.log('no data available');
                            runSearch();
                        };
                        for (i = 0; i <res.length; i++){
                                if (res[i].department === answer.departments){
                                
                                // console.log(res[i]);
                                table.push(res[i]);
                            }
                        }
                        if (i = res.length - 1){
                            console.log('-------------------------------')
                            console.table(table)
                            runSearch();
                        
                        }
                })

            })
                    
        })
         
}

  function allEmployees (){
    connection.query(`SELECT e.id, first_name, last_name, title, name AS department, salary, manager_id
    FROM role r, department d, employee e WHERE r.department_id = d.id and  e.role_id = r.id`, function(err, res) {
        if (err) {
            console.log('no data available');
            runSearch();
        };
        console.table(res);
        runSearch();
    })
}

  function addDept() {
      inquirer.prompt({
          name: 'addDepartment',
          type: 'input',
          message: "What is the new Department's name?"
      })
      .then(function(answer){

          connection.query(`INSERT INTO department SET ?`, 
            {
            name: answer.addDepartment
            }, 
            function(err, res) {
                if (err) {
                    console.log('no data available');
                    runSearch();
                };
            console.log(`${answer.addDepartment} added!`);
            })
            
            connection.query('Select * FROM department', function (err, res){
                if (err) {
                    console.log('no data available');
                    runSearch();
                };
                console.table(res);
                runSearch();
            })
      })
}

function removeDept() {
    connection.query('Select name FROM department', function (err, res){
        if (err) {
            console.log('no data available');
            runSearch();
        };
        let names = res;
        inquirer.prompt({
            name: 'removeDept',
            type: 'list',
            message: 'What department would you like to remove',
            choices: names
        })
        .then(function(answer){
            connection.query(`DELETE FROM department WHERE name = "${answer.removeDept}"`, function (err, res){
                if (err) throw (err);
                console.log(`${answer.removeDept} removed`);

                connection.query('Select * FROM department', function (err, res){
                    if (err) throw (err);
                    console.table(res);
                    runSearch();
            })
        })
        })
    })
}

function addRole (){
    connection.query('Select * FROM department', function (err, res){
        if (err) {
            console.log('no data available');
            runSearch();
        };
        let names = res;
        inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of this role?'
         },
         {
             name: 'salary',
             type: 'input',
             message: 'What is the salary for this role?'
         },
         {
             name: 'department',
             type: 'list',
             message: 'What department does this role belong to?',
             choices: names
         }

        ])
        .then(function(answer){
        
            for (i = 0; i < res.length; i++){
                if (answer.department === res[i].name){
                        connection.query(`INSERT INTO role SET ?`, {
                                title: answer.title,
                                salary: answer.salary,
                                department_id: res[i].id },

                            function (err, result) {
                                if (err) throw (err);
                                console.log (`${answer.title} added!`)
                                runSearch();
                            }  
                        )
                };  
            }
        })
        
    })
        
    
}

function addEmploy(){
    connection.query('Select role.title, role.id AS roleID, CONCAT (employee.first_name, " ", employee.last_name) as fullname, employee.id as employeeID FROM role, employee', function (err, res){
        
        if (err) throw (err);
        let roles = [];
        let employees = ['None'];
        for (i = 0; i < res.length; i++){
            employees.push(res[i].fullname);
            roles.push(res[i].title);
        }
        roles = [... new Set(roles)]
        employees = [...new Set(employees)]
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the first name of the employee?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name of the employee?'
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'What is the role of the employee?',
                choices: roles
            },
            {
                name: 'manager_name',
                type: 'list',
                choices: employees
            }, 
        ])
        .then (function(answers){

            for (i = 0; i < res.length; i ++){
                if (answers.role_id === res[i].title){
                    roleID = res[i].roleID
                }

                if(answers.manager_name === res[i].fullname){
                    employeeID = res[i].employeeID
                }

            }
                    if (answers.manager_name === 'None'){
                        connection.query(`INSERT INTO employee SET ?`, {
                            first_name: answers.first_name,
                            last_name: answers.last_name,
                            role_id: roleID,
                         },
                         function (err, result) {
                            if (err) throw (err);
                            console.log (`${answers.first_name} added!`);
                            runSearch();
                        })
                        
    
                    }
                    else{
                connection.query(`INSERT INTO employee SET ?`, {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: roleID,
                    manager_id: employeeID
                 },

                    function (err, result) {
                        if (err) throw (err);
                        console.log (`${answers.first_name} added!`)
                        runSearch();
                })} }

        
)}
    )
}

function removeRole() {
    connection.query('SELECT title FROM role', function (err, response){
        if (err) {
            console.log('no data available');
            runSearch();
        };
        let roles = [];
        for (i = 0; i < response.length; i++){
            roles.push(response[i].title)
        }
        inquirer.prompt({
            name: 'removeRole',
            type: 'list',
            message: 'What Role would you like to remove?',
            choices: roles
        })
        .then(function(answer){
            connection.query(`DELETE FROM role WHERE title = "${answer.removeRole}"`, function (err, res){
                if (err) throw (err);
                console.log(`${answer.removeRole} removed`);

                connection.query('Select * FROM role', function (err, res){
                    if (err) throw (err);
                    console.table(res);
                    runSearch();
            })
        })
        })
    })
}

function removeEmploy() {
    connection.query('SELECT id, CONCAT (employee.first_name, " ", employee.last_name) fullname FROM employee', function (err, response){
        if (err) {
            console.log('no data available');
            runSearch();
        };
        let employee = [];
        for (i = 0; i < response.length; i++){
            employee.push(response[i].fullname)
        }
        inquirer.prompt({
            name: 'removeEmploy',
            type: 'list',
            message: 'Which Employee would you like to remove?',
            choices: employee
        })
        .then(function(answer){
            for (i = 0; i < response.length; i ++){
                if (answer.removeEmploy === response[i].fullname){
                    ident = response[i].id
                    console.log(ident);
                }
            }
            connection.query(`DELETE FROM employee WHERE id = "${ident}"`, function (err, res){
                if (err) throw (err);
                console.log(`${answer.removeEmploy} removed`);

                connection.query('Select * FROM employee', function (err, res){
                    if (err) throw (err);
                    console.table(res);
                    runSearch();
            })
        })
        })
    })
}
    






