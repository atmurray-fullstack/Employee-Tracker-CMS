USE employee_managementdb;

CREATE TABLE department(
    id INT(30) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(50)
    
);

CREATE TABLE role(
    id INT(30) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(50),
    salary DECIMAL (10,2), 
    department_id INT(30),
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee(
    id INT(30) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    role_id INT(30) NOT NULL,
    manager_id INT(30),
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);