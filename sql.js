const mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.password,
    database: 'bamazon_db'
});

module.exports = connection;