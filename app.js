const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require ('mysql');
let ident;
let employeeID;
let roleID;


var connection = mysql.createConnection({
    host : 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
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
              'View all Employees by Danager',
              'Add an Employee',
              'Remove an Employee',
              "Update an Employee's Role",
              "Update an Employee's Manager",
              'Add Department',
              'Add Role',
              'Remove Department',
              'Remove Role',
              'View a Department Budget'
            
          ]
      })
      .then(function(answer){
          switch(answer.action) {

                case 'View all Employees':
                    allEmployees();
                    // console.log('All Employee')
                    break;

                case 'View all Employees by Department':
                    allDept();
                    // console.log('Department Employees')
                    break;

                case 'View all Employees by Manager':
                    allManager();
                    // console.log('Manager Employees')
                    break;

                case 'Add an Employee':
                    addEmploy();
                    // console.log('Employee Added')
                    break;
                
                case 'Remove an Employee':
                    removeEmploy();
                    // console.log('Employee Removed')
                    break;

                case "Update an Employee's Role":
                    // updateRole();
                    console.log("Role updated")
                    break;

                case "Update an Employee's Manager":
                    // updateManager();
                    console.log('Manager udated');
                    break;

                case 'Add Department':
                    addDept();
                    // console.log('Department added');
                    break;

                case 'Add Role':
                    addRole();
                    // console.log('Role Added')
                    break;

                case 'Remove Department':
                    removeDept();
                    // console.log('Department Added')
                    break;

                case 'Remove Role':
                    removeRole();
                    // console.log('Role Removed');
                    break;

                case 'View a Department Budget':
                    // deptBudge();
                    console.log('There is no budget!')
                    break;

          }
          connection.end()
      })  
     
  }

 function updateRole(){
     connection.query()
 } 

function allManager(){
    connection.query(`SELECT e.id, first_name, last_name, title, name as department, salary, manager_id as manager
    from role r, department d, employee e where r.department_id = d.id and  e.role_id = r.id`, function (err, res){
        if (err) throw (err);
        let list = [];
        for (i = 0; i < res.length; i ++){
            list.push(res[res[i].manager_id].first_name + " " + res[res[i].manager_id].last_name)
            list = [...new Set(list)];
        }
        inquirer.prompt([
            {
                name: 'manager',
                type: 'list',
                message: 'What manager would you like to select?',
                choices: list
            }
   
           ])
           .then(function(answer){
            for (i = 0; i < res.length; i ++){
                if (answer.manager === res[res[i].manager_id].first_name + " " + res[res[i].manager_id].last_name){
                    connection.query(`SELECT e.id, first_name, last_name, title, name as department, salary, manager_id as manager
                    from role r, department d, employee e where r.department_id = d.id and  e.role_id = r.id and e.manager_id = ${res[i].id}`, function (err, res){
                        if (err) throw (err); 
                        console.table(res);
                        runSearch();

                    })
                }
            }
           })
        
    })
}

  function allDept(){
      connection.query('Select * FROM department', function (err, result){
          if (err) throw (err);
          let names = res;
          inquirer.prompt([
             {
                 name: 'department',
                 type: 'list',
                 message: 'What department would you like to see?',
                 choices: names
             }
    
            ])
            .then(function(answers){
                for (i = 0; i < res.length; i++){
                    if (answer.department === res[i].name){
                        connection.query(`SELECT e.id, first_name, last_name, title, name as department, salary, manager_id as manager
                        from role r, department d, employee e where r.department_id = d.id and  e.role_id = r.id and d.name = ${answer.department}`, function (err,res){
                            if (err) throw (err);
                            console.table(res);
                            runSearch();
                        })
                    }}
            })
         
      })
  }

  function allEmployees (){
    connection.query(`SELECT e.id, first_name, last_name, title, name AS department, salary, manager_id
    FROM role r, department d, employee e WHERE r.department_id = d.id and  e.role_id = r.id`, function(err, res) {
        if (err) throw err;
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
            if (err) throw (err);
            console.log(`${answer.addDepartment} added!`);
            })
            
            connection.query('Select * FROM department', function (err, res){
                if (err) throw (err);
                console.table(res);
                runSearch();
            })
      })
  }

function removeDept() {
    connection.query('Select name FROM department', function (err, res){
        if (err) throw (err);
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
        if (err) throw (err);
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

                if (answers.manager_name === 'None'){
                    connection.query(`INSERT INTO employee SET ?`, {
                        first_name: answers.first_name,
                        last_name: answers.last_name,
                        role_id: roleID,
                     },
                     function (err, result) {
                        if (err) throw (err);
                        console.log (`${answers.first_name} added!`)
                })
                    runSearch();
                    break;

                }
                }
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
                }) 

        }
)}
    )}

function removeRole() {
    connection.query('SELECT title FROM role', function (err, response){
        if (err) throw (err);
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
        if (err) throw (err);
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
    






