const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const fs = require('fs');
const actions = require('./Assets/actions');

var connection = mysql.createConnection({
    multipleStatements: true,
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "employee_managementdb"
});

connection.connect(function (err) {
    if (err) throw err;

    // run the start function after the connection is made to prompt the user
    actions.start()
        .then(ans => {
            console.log('You chose ' + ans.action);
            switch (ans.action) {
                case 'Add Content':
                    actions.addContent()
                        .then((ans) => {
                            switch (ans.addAction) {
                                case 'Add Employee':
                                    actions.addEmployeeInfo();
                                    break
                                case 'Add Role':
                                    actions.addRoleInfo();
                                    break
                                case 'Add Department':
                                    actions.addDepartmentInfo();
                            }
                        })
                    break;
                case 'View Content':
                    actions.viewContent();
                        
                    break;
                case 'Update Content':
                    actions.updateContent()
                        .then(ans => {
                            switch(ans.updateAction){
                                case 'Employee role':
                                    actions.updateEmployeeRoles();
                                    break
                                case 'Employee manager':
                                    actions.updateEmployeeManager();
                                    break
                            }
                        })
                    break;
                case 'Delete Content':
                    actions.deleteContent()
                        .then(ans => {
                            console.log(ans.deleteAction);
                        })
                    break;
                case 'EXIT':
                    connection.end();
                    break;
            }
            return;
        })

});





