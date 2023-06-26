var mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'database-1.cinr6fkc8ghc.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: '11111111',
    database: 'list',
    port: '3306',
    dateStrings: 'date',
});

// RDS에 접속합니다
connection.connect(function (err) {
    if (err) {
        throw err;  // 접속에 실패하면 err 
    } else {
        // connection.query("create database list", function(err, rows, fields) {
        //     console.log(rows); // 결과를 출력합니다!
        //   });
        // connection.query("show databases", function (err, rows, fileds) {
        //     console.log(rows);
        // });

        // connection.query('create table productlist (number INT NOT NULL PRIMARY KEY, name VARCHAR(100) NOT NULL, quantity int NOT NULL, price int NOT NULL, code varchar(100) NOT NULL, time datetime not null);', (error, results, fields) => {
        //     if (error) throw error;
        //     console.log(results);
        // });

        // connection.query('insert into productlist values (1,"슬리퍼",3,40000,"123-asd78","2023-05-10")', (err, results, fields) => {
        //     if (err) throw err;
        // });

        connection.query("select * from productlist",(err, results, fields) => {
            if (err) throw err;
            console.log(results);
        });

        console.log("연결 완료")
    }
})