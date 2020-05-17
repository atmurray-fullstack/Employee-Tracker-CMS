USE employee_managementdb;

CREATE TABLE department(
    id INT(30) NOT NULL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    role_id INT(30) NOT NULL,
    manager_id INT(30)
)