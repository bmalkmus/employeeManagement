CREATE database employee_DB;
use employee_DB;

CREATE TABLE department (
id int not null auto_increment,
name varchar(30) not null,
primary key (id)
);

create table role (
    id int not null auto_increment,
    title varchar(30) not null,
    salary DECIMAL (8, 2) not null,
    department_id int not null,
    primary key (id),
    FOREIGN KEY (department_id) references department(id)
);

CREATE TABLE employee (
    id int not null auto_increment,
    first_name varchar(30) not null,
    last_name varchar (30) not null,
    role_id int not null,
    manager_id int null,
    primary key (id),
    FOREIGN KEY (role_id) references role(id),
    FOREIGN KEY (manager_id) references employee(id)
);
