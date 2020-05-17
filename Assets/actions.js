const inquirer = require('inquirer');
const mysql = require ('mysql');

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
                'Delete Content'
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
                'Update Employee',
                'Update Role',
                'Update Department'
            ]
        }
    ])
};

const viewContent = () => {
    return inquirer.prompt([
        {
            type: 'rawlist',
            name: 'viewAction',
            message: 'What would you like to view?',
            choices: [
                'view Employees',
                'veiw Roles',
                'veiw Departments'
            ]
        }
    ])
};

const addDepartmentInfo = (ans) => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the department\'s name?'
        }
    ])
};

const addEmployeeInfo = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee\'s first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?',
        }
    ])
};

const addRoleInfo = () => {
    return inquirer.prompt([
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
            type: 'rawlist',
            name: 'dept',
            message: 'What department should the role be placed in?',
            choices:[]
        }
    ])
};





exports.start = start;
exports.addContent = addContent;
exports.deleteContent = deleteContent;
exports.updateContent = updateContent;
exports.viewContent = viewContent;
exports.addEmployeeInfo =addEmployeeInfo;
exports.addRoleInfo = addRoleInfo;
exports.addDepartmentInfo = addDepartmentInfo;
