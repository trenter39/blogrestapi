# Blog Post REST API

RESTful API built with **Node.js**, **Express** and **MySQL**. It provides endpoints to manage blog posts, comments, and users - including creating, reading, updating, deleting, and searching. Basic info and endpoints of the API are documented in [API.md](https://github.com/trenter39/blogrestapi/blob/master/API.md) file.

## Setup Instructions

1. Install packages via **npm**. Packages include: bcrypt, dotenv, express, mysql2.
```
npm install
```
2. Create database and tables in **MySQL**. Run the following SQL to set up the database schema:
```
create database if not exists postapidb;
use postapidb;

create table posts (
    id int primary key auto_increment,
    title varchar(150) not null,
    content text not null,
    category varchar(50),
    tags varchar(255) not null,
    createdAt DATETIME not null default current_timestamp,
    updatedAt DATETIME not null default current_timestamp on update current_timestamp
);

create table comments (
    id int primary key auto_increment,
    postID int not null,
    author varchar(100) not null,
    content text not null,
    createdAt DATETIME not null default current_timestamp,
    updatedAt DATETIME not null default current_timestamp on update current_timestamp,
    foreign key (postID) references posts(id) on delete cascade
);
```
or you can run the schema file to set up the database:
```
mysql -u root -p postapidb < postapidb.sql
```

3. Configure connection to **MySQL** by creating `.env` file in the root folder. `.env` file must contain fields (example values shown):
```
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=postapidb
DB_PORT=3306
```
4. Start the server via **node**
```
node app.js
```
5. Test API using tools like **Postman** to interact with the API

![API GET request preview](https://github.com/trenter39/blogrestapi/blob/master/preview.png)