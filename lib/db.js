const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'database-1.cinr6fkc8ghc.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: '11111111',
    database: 'list',
    port: '3306',
    dateStrings: 'date',
});

connection.connect();

module.exports = connection;