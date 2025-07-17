# Blog Post REST API

RESTful API build with **Node.js**, **Express** and **MySQL**. It provides endpoints to manage blog posts, including creating, reading, updating, deleting, and searching posts. Basic info and endpoints of API are written in file `API.md`

## Setup Instructions

1. Install packages via **npm**. Packages include: dotenv, express and mysql2
```
npm install
```
2. Create database and table in **MySQL**. Otherwise, the server will arise database errors
```
create database if not exists apidb;

use apidb;

create table posts (
    id int primary key auto_increment,
    title varchar(255),
    content text,
    category varchar(100),
    tags text,
    createdAt varchar(255),
    updatedAt varchar(255)
);
```
3. Configure connection to **MySQL** by creating `.env` file in the root folder. `.env` file must contain fields (example with default values):
```
PORT=8080, DB_HOST=localhost, DB_USER=root, DB_PASSWORD=password, DB_NAME=apidb, DB_PORT=3306
```
4. Start the server via **node**
```
node app.js
```
5. Test API using tools like **Postman**

![API GET request preview](https://github.com/trenter39/blogrestapi/blob/master/preview.png)