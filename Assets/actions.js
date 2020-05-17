const inquirer = require('inquirer');

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

exports.start = start;
exports.addContent = addContent;
exports.deleteContent = deleteContent;
exports.updateContent = updateContent;
exports.viewContent = viewContent;