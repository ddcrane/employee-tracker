INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesperson', '50000', 1),
('Sales Lead', '80000', 1), 
('Lead Engineer', '150000', 2),
('Junior Engineer', '75000', 2),
('Accountant', '65000', 3),
('Lead Accountant', '120000', 3),
('Lawyer', '100000', 4),
('Legal Team Lead', '200000', 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Dave', 'Ramsey', 2),
('Rick', 'Perry', 5, 3),
('Matthew', 'Perry', 6),

