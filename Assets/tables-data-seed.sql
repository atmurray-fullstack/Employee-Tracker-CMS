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
VALUES('Teacher',35000.12,5);

INSERT INTO role(title, salary, department_id)
VALUES('Nurse',45000.12,1);

INSERT INTO role(title, salary, department_id)
VALUES('student',0,3);

INSERT INTO role(title, salary, department_id)
VALUES('Coach',38000.12,3);

INSERT INTO role(title, salary, department_id)
VALUES('Superintendent',78000.99,5);

--EMPLOYEES
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Scott','Weiland', 5,null);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Elen','DuBree', 2,1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Henery','McClatchen', 4,1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Pete','Smith', 3,2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Martha','Peterbuilt', 1,1);

