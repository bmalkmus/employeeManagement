const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require ('mysql');


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
                    addRole();
                    // console.log('Role Added')
                    break;

                case 'Remove department':
                    removeDept();
                    // console.log('Department Added')
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
        //   connection.end()
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
                            }  
                        )
                };  
            }
        })
        
    })
        
    
}






