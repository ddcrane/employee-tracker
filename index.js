const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Myrrh92!",
    database: "tracker"
  });

  function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View all Employees", 
              "View Employees by role",
              "View Employees by department", 
              "Update Employee",
              "Add Employee",
              "Add Role",
              "Add Department"
            ]
    }
]).then(function(value) {
        switch (value.choice) {
            case "View all Employees":
              viewEmployees();
            break;
          case "View Employees by role":
              viewRoles();
            break;
          case "View Employees by department":
              viewDepartments();
            break;
            case "Update Employee":
                updateEmployee();
              break;
          case "Add Employee":
                addEmployee();
              break;
            case "Add Role":
                addRole();
              break;
            case "Add Department":
                addDepartment();
              break;
            }
    })
}

function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}

function viewRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
    })
  }

  function viewDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
  }

  var roleArray = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
    }
  })
  return roleArray;
}

var managersArray = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArray.push(res[i].first_name);
    }
  })
  return managersArray;
}

// add department
function addDepartment() { 
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What new department would you like to add?"
      }
  ]).then(function(res) {
  connection.query("INSERT INTO department SET ? ",
          {
            name: res.name
          },
          function(err) {
              if (err) throw err
              console.table(res);
              startPrompt();
          }
      )
  })
}

// add role
function addRole() { 
connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
  inquirer.prompt([
      {
        name: "Title",
        type: "input",
        message: "What is the new role?"
      },
      {
        name: "Salary",
        type: "input",
        message: "What is the new role's salary?"

      } 
  ]).then(function(res) {
      connection.query(
          "INSERT INTO role SET ?",
          {
            title: res.Title,
            salary: res.Salary,
          },
          function(err) {
              if (err) throw err
              console.table(res);
              startPrompt();
          }
      )
  });
});
}


// add employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "Enter the new employee's first name."
      },
      {
        name: "last_name",
        type: "input",
        message: "Enter the new employee's last name."
      },
      {
        name: "role",
        type: "list",
        message: "What is the new employee's role?",
        choices: selectRole()
      },
      {
          name: "choice",
          type: "rawlist",
          message: "What is the new employee's manager name?",
          choices: selectManager()
      }
  ]).then(function (value) {
    var roleId = selectRole().indexOf(value.role) + 1
    var managerId = selectManager().indexOf(value.choice) + 1
    connection.query("INSERT INTO employee SET ?", 
    {
        first_name: value.first_name,
        last_name: value.last_name,
        manager_id: managerId,
        role_id: roleId
        
    }, function(err){
        if (err) throw err
        console.table(value)
        startPrompt()
    })

})
}

// update employee
function updateEmployee() {
  connection.query("SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
   if (err) throw err
   console.log(res)
  inquirer.prompt([
        {
          name: "last_name",
          type: "rawlist",
          choices: function() {
            var last_name = [];
            for (var i = 0; i < res.length; i++) {
              last_name.push(res[i].last_name);
            }
            return last_name;
          },
          message: "What is the employee's last name?",
        },
        {
          name: "role",
          type: "rawlist",
          message: "What is the employee's new title?",
          choices: selectRole()
        },
    ]).then(function(value) {
      var newRoleId = selectRole().indexOf(value.role) + 1
      connection.query("UPDATE employee SET WHERE ?", 
      {
        last_name: value.last_name
      }, 
      {
        role_id: newRoleId
      }, 
      function(err){
          if (err) throw err
          console.table(value)
          startPrompt()
      })

  });
});

}

startPrompt();