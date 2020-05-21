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


    // run the start function after the connection is made to prompt the user
    prompt()
        .then(ans => {
            console.log('You chose ' + ans.action);
            switch (ans.action) {
                case 'Add Content':
                    addContent()
                        .then((ans) => {
                            switch (ans.addAction) {
                                case 'Add Employee':
                                    addEmployeeInfo();
                                    break
                                case 'Add Role':
                                    addRoleInfo();
                                    break
                                case 'Add Department':
                                    addDepartmentInfo();
                            }
                        })
                    break;
                case 'View Content':
                    viewContent();

                    break;
                case 'Update Content':
                    updateContent()
                        .then(ans => {
                            switch (ans.updateAction) {
                                case 'Employee role':
                                    updateEmployeeRoles();
                                    break
                                case 'Employee manager':
                                    updateEmployeeManager();
                                    break
                            }
                        })
                    break;
                case 'Delete Content':
                    deleteContent()
                        .then(ans => {
                            console.log('functionality of '+ans.deleteAction+' is still in progress');
                            start();
                        })
                    break;
                case 'EXIT':
                    connection.end();
                    process.exit();
            }
            return;
        })



};





const prompt = () => {
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
                        console.log('_'.repeat(100));
                        console.log('Employee role updated successfully!');
                        console.log('_'.repeat(100));

                        start();
                    })
            })
        })
    })
};

const updateEmployeeManager = () => {
    connection.query('SELECT * FROM employee', function (err, employee) {
        if (err) throw err;
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
                type: 'rawlist',
                message: 'Who will their new manager be?',
                name: 'manager',
                choices: function () {
                    const arr = [];
                    for (let i = 0; i < employee.length; i++) {
                        arr.push(employee[i].id + ' ' + employee[i].first_name + ' ' + employee[i].last_name);
                    }
                    return arr;
                }
            }

        ]).then((ans) => {
            connection.query('UPDATE employee SET ? WHERE ?',
                [{
                    manager_id: parseInt(ans.manager[0])
                },
                {
                    id: parseInt(ans.employee_name[0])
                }]
                , (err) => {
                    if (err) throw err;
                    console.log('_'.repeat(100));
                    console.log('Employee manager updated successfully!');
                    console.log('_'.repeat(100));

                    start();
                })
        })
    })
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
                                if (ans.viewAction === 'View total department budgets') {

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
                                    console.log(' '.repeat(2));
                                    console.log('Displaying departments and budgets utilized.');
                                    console.log('_'.repeat(100));
                                    console.table(dept);
                                    start();

                                } else if (ans.viewAction === 'Employees') {

                                    for (let i = 0; i < employees.length; i++) {
                                        employees.forEach(function (element) {
                                            if (employees[i].manager_id === element.id) {
                                                employees[i].manager = element.first_name + ' ' + element.last_name;
                                            }
                                        })


                                        for (let e = 0; e < roles.length; e++) {
                                            if (employees[i].role_id === roles[e].id) {
                                                employees[i].title = roles[e].title;
                                                employees[i].salary = roles[e].salary;
                                                employees[i].dept = roles[e].department_id;
                                            }
                                        }

                                        for (let e = 0; e < dept.length; e++) {
                                            if (employees[i].dept === dept[e].id) {
                                                employees[i].dept = dept[e].name;

                                            }
                                        }
                                    }

                                    employees.forEach((elem) => {
                                        delete elem.role_id
                                        delete elem.manager_id
                                    })
                                    console.log('_'.repeat(100))
                                    console.log('Displaying ' + ans.viewAction);
                                    console.log('_'.repeat(100))
                                    console.table(employees)
                                    start();

                                } else if (ans.viewAction === 'Departments') {

                                    inquirer.prompt([
                                        {
                                            type: 'list',
                                            name: 'dept',
                                            message: 'What department would you like to view?',
                                            choices: function () {
                                                let arr = [];
                                                department.forEach((el) => {
                                                    arr.push(el.id + ' ' + el.name)
                                                })
                                                return arr
                                            }
                                        }
                                    ]).then((answer) => {
                                        const employeeObj = {};
                                        employeeObj.roles = [];
                                        employeeObj.id = parseInt(answer.dept[0]);
                                        roles.forEach((el) => {
                                            if (el.department_id === employeeObj.id) {
                                                employeeObj.roles.push({ id: el.id, title: el.title })
                                                employeeObj.department = answer.dept.slice(2, answer.dept.length);
                                            }
                                        })
                                        // console.log(employeeObj);
                                        employees.forEach((deptEmployee) => {
                                            for (let i = 0; i < employees.length; i++) {
                                                if (deptEmployee.manager_id === employees[i].id) {
                                                    deptEmployee.manager = employees[i].first_name + ' ' + employees[i].last_name;
                                                    delete deptEmployee.manager_id
                                                }
                                            }
                                            for (let i = 0; i < employeeObj.roles.length; i++) {
                                                if (deptEmployee.role_id === employeeObj.roles[i].id) {
                                                    deptEmployee.title = employeeObj.roles[i].title;
                                                    deptEmployee.department = employeeObj.department;
                                                    delete deptEmployee.role_id;
                                                }
                                            }
                                        })
                                        for (let i = 0; i < employees.length; i++) {
                                            if (!employees[i].title) {
                                                delete employees[i]
                                            }
                                        }
                                        console.table(employees);

                                        start();
                                    })
                                } else (
                                    inquirer.prompt([
                                        {
                                            type: 'rawlist',
                                            name: 'role',
                                            message: 'What work role would you like to view?',
                                            choices: function () {
                                                let arr = [];
                                                role.forEach((el) => {
                                                    arr.push(el.id + ' ' + el.title);
                                                })
                                                return arr;
                                            }
                                        }
                                    ])
                                        .then((roleAns) => {
                                            console.log(roleAns);
                                            const id = parseInt(roleAns.role[0]);
                                            console.log(id);
                                            employees.forEach((roleEmployee) => {
                                                if (roleEmployee.role_id === id) {
                                                    roleEmployee.title = roleAns.role.slice(2, roleAns.role.length);
                                                }
                                                for (let i = 0; i < employees.length; i++) {
                                                    if (roleEmployee.manager_id === employees[i].id) {
                                                        roleEmployee.manager = employees[i].first_name + ' ' + employees[i].last_name;
                                                    }
                                                    delete roleEmployee.manager_id;
                                                }

                                            })
                                            for (let i = 0; i < employees.length; i++) {
                                                if (!employees[i].title) {
                                                    delete employees[i];
                                                }
                                            }
                                            console.table(employees);
                                            start();

                                        })
                                )
                            })
                    })
            })

    })
}


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
exports.prompt = prompt;
exports.addContent = addContent;
exports.deleteContent = deleteContent;
exports.updateContent = updateContent;
exports.updateEmployeeRoles = updateEmployeeRoles;
exports.updateEmployeeManager = updateEmployeeManager;
exports.viewContent = viewContent;
exports.addEmployeeInfo = addEmployeeInfo;
exports.addRoleInfo = addRoleInfo;
exports.addDepartmentInfo = addDepartmentInfo;
