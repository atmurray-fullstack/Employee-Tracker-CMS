USE employee_managementdb;
--DEPARTMENT
INSERT INTO department(name)
VALUES('health');

INSERT INTO department(name)
VALUES('sports');

INSERT INTO department(name)
VALUES('technology');

INSERT INTO department(name)
VALUES('academics');

--ROLE
INSERT INTO role(title, salary, department_id)
VALUES('Teacher',35000.12,4);

INSERT INTO role(title, salary, department_id)
VALUES('Nurse',45000.12,1);

INSERT INTO role(title, salary, department_id)
VALUES('student',0,4);

INSERT INTO role(title, salary, department_id)
VALUES('Coach',38000.12,2);

INSERT INTO role(title, salary, department_id)
VALUES('Superintendent',78000.99,4);

--EMPLOYEES
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Scott','Weiland', 7,null);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Elen','DuBree', 3,1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Henery','McClatchen', 6,1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Pete','Smith', 5,2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Martha','Peterbuilt', 4,1);

