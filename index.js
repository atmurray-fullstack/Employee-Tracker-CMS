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
actions.start();
});




