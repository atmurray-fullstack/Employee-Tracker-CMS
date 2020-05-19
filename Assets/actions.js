const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const fs = require('fs');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "employee_managementdb"
});

const start = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'Add Content',
                'View Content',
                'Update Content',
                'Delete Content',
                'EXIT'
            ]
        }
    ])
};

// add content
const addContent = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'addAction',
            message: 'What would you like to add?',
            choices: [
                'Add Employee',
                'Add Role',
                'Add Department'
            ]
        }
    ])
};
// delete content from db
const deleteContent = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'deleteAction',
            message: 'What would you like to delete?',
            choices: [
                'Delete Employee',
                'Delete Role',
                'Delete Department'
            ]
        }
    ])
};

const updateContent = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'updateAction',
            message: 'What would you like to update?',
            choices: [
                'Employee role',
                'Employee manager'
            ]
        }
    ])
};

const updateEmployeeRoles = () => {
    connection.query('SELECT * FROM role', function (err, roles) {
        if (err) throw err;

        connection.query('SELECT * FROM employee', function (err, employee) {
            if (err) throw err;
            console.log(roles)
            console.log(employee)
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_name',
                    message: 'Who would you like to reassign?',
                    choices: function () {
                        const arr = [];
                        for (let i = 0; i < employee.length; i++) {
                            arr.push(employee[i].id + ' ' + employee[i].first_name + ' ' + employee[i].last_name);
                        }
                        return arr;
                    }
                },
                {
                    type: 'list',
                    message: 'What will their new role be?',
                    name: 'role',
                    choices: function () {
                        const arr = [];
                        for (let i = 0; i < roles.length; i++) {
                            arr.push(roles[i].id + ' ' + roles[i].title);
                        }
                        return arr
                    }
                }

            ]).then((ans) => {
                connection.query('UPDATE employee SET ? WHERE ?',
                    [{
                        role_id: parseInt(ans.role[0])
                    },
                    {
                        id: parseInt(ans.employee_name[0])
                    }]
                    , (err) => {
                        if (err) throw err;
                        console.log('Employee role updated successfully!');
                    })
            })
        })
    })
};

const updateEmployeeManager = () => {
    console.log(ans.updateAction);
};

const viewContent = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'viewAction',
            message: 'What would you like to view?',
            choices: [
                'Employees',
                'Roles',
                'Departments',
                'View total department budgets'
            ]
        }
    ]).then((ans) => {
        let choice = ans.viewAction.toLowerCase().slice(0, ans.viewAction.length - 1);
        if (ans.viewAction === 'View total department budgets') {
            console.log(' '.repeat(2));
            console.log('Displaying departments and budgets utilized.');
            console.log('_'.repeat(100));
            connection.query(
                'SELECT * FROM employee', (err, employee) => {
                    if (err) throw err;
                    connection.query(
                        'SELECT * FROM role', (err, role) => {
                            if (err) throw err;
                            connection.query(
                                'SELECT * FROM department', (err, department) => {
                                    if (err) throw err;
                                    const dept = department;
                                    const roles = role;
                                    const employees = employee;

                                    for (let i = 0; i < roles.length; i++) {
                                        roles[i].employee_cnt = 0;
                                        for (let e = 0; e < employees.length; e++) {
                                            if (employees[e].role_id === roles[i].id) {
                                                roles[i].employee_cnt += 1
                                            }
                                        }
                                    }
                                    for (let i = 0; i < dept.length; i++) {
                                        dept[i].budget_utilized = 0;
                                        for (let e = 0; e < roles.length; e++) {
                                            if (roles[e].department_id === dept[i].id) {
                                                dept[i].budget_utilized += roles[e].salary * roles[e].employee_cnt;
                                            }
                                        }
                                    }
                                    console.table(dept);

                                }
                            )
                        }
                    )
                }
            )
        } else {
            connection.query(
                'SELECT * FROM ' + choice, (err, results) => {
                    if (err) throw err;
                    console.log('_'.repeat(100))
                    console.log('Displaying ' + ans.viewAction);
                    console.log('_'.repeat(100))
                    console.table(results);

                }
            )
        }
    });
};

const addDepartmentInfo = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the department\'s name?'
        }
    ])
        .then((ans) => {
            connection.query(
                "INSERT INTO department SET ?",
                ans,
                function (err) {
                    if (err) throw err;
                    console.log("New department created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            )
        });
};

const addEmployeeInfo = () => {
    connection.query('SELECT * FROM role', function (err, roles) {
        if (err) throw err;

        connection.query('SELECT * FROM employee', function (err, employee) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the first name of the employee?',
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the last name of the employee?',
                    },
                    {
                        type: 'list',
                        name: 'role_id',
                        message: 'What will be the employee\'s job?',
                        choices: function () {
                            var arr = [];
                            for (let i = 0; i < roles.length; i++) {
                                arr.push(roles[i].id + ' ' + roles[i].title);
                            }
                            return arr;
                        }
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Who will be the employee\'s Manager?',
                        choices: function () {
                            var arr = [];
                            for (let i = 0; i < employee.length; i++) {
                                arr.push(employee[i].id + ' ' + employee[i].first_name + ' ' + employee[i].last_name);
                            }
                            return arr;
                        }
                    }
                ])
                .then((ans) => {

                    employeeObj = {
                        first_name: ans.first_name,
                        last_name: ans.last_name,
                        role_id: parseInt(ans.role_id[0]),
                        manager_id: parseInt(ans.manager_id[0])
                    }
                    connection.query(
                        "INSERT INTO employee SET ?",
                        employeeObj,
                        function (err) {
                            if (err) throw err;
                            console.log("New employee recorded successfully!");
                            // re-prompt the user for if they want to bid or post
                            start();
                        }
                    )
                })
        })

    });
};

const addRoleInfo = () => {
    connection.query('SELECT * FROM department', function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the name of the role?',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?',
                },
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department should the role be placed in?',
                    choices: function () {
                        var arr = [];
                        for (let i = 0; i < results.length; i++) {
                            arr.push(results[i].name);
                        }
                        return arr;
                    }
                }
            ]).then((ans) => {

                const { title: title, salary: salary, dept: dept } = ans;
                roleObj = {
                    title: title,
                    salary: parseFloat(salary),
                    department_id: dept
                }
                results.forEach((item, index) => {
                    if (item.name === roleObj.department_id) {
                        roleObj.department_id = item.id;
                    }
                });

                connection.query(
                    "INSERT INTO role SET ?",
                    roleObj,
                    function (err) {
                        if (err) throw err;
                        console.log("New role created successfully!");
                        // re-prompt the user for if they want to bid or post
                        start();
                    }
                )
            })


    });
};





exports.start = start;
exports.addContent = addContent;
exports.deleteContent = deleteContent;
exports.updateContent = updateContent;
exports.updateEmployeeRoles = updateEmployeeRoles;
exports.updateEmployeeManager = updateEmployeeManager;
exports.viewContent = viewContent;
exports.addEmployeeInfo = addEmployeeInfo;
exports.addRoleInfo = addRoleInfo;
exports.addDepartmentInfo = addDepartmentInfo;
