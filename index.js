
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const url = require('url');
const session = require('express-session');
const filestore = require('session-file-store')(session);
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./lib/db');

const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard dog',
    resave: false,
    saveUninitialized: true,
    store: new filestore(),
}));
app.use(passport.initialize());
app.use(passport.session());

//  serializeUser메서드는 로그인에 성공했을 때 사용자 정보가 세션에 기록되도록 한다.
passport.serializeUser(function (user, done) {
    // 로그인에 성공했을 때의 사용자 정보
    console.log('serializeUser', user)
    done(null, user.username);
});
// deserializeUser메서드는 페이지에 방문할 때마다 호출되도록 약속되어 있다. 이때 콜백함수의 첫 번째 인자로 사용자를 식별하는 값(id)를 전달받는다.
passport.deserializeUser(function (id, done) {
    // 매 페이지에 접속할 때 마다 호출됨
    // console.log('deserializeUser', id)
    done(null, authData);
});


const authData = {
    username: 'tjrtktjrtk',
    password: '111111',
    nickname: 'onetwo',
};

app.get('/', (req, res) => {
    fs.readFile('public/login.html', 'utf-8', (error, data) => {
        res.send(data);
        if (error) throw error;
    });
});

app.get('/main', (req, res) => {
    fs.readFile('public/list.html', 'utf-8', (err, data) => {
        connection.query('select * from productlist', (err, results, fields) => {
            if (err) throw err;
            res.send(ejs.render(data, {
                data: results,
                login: '로그아웃',
                loginlink: 'logout',
                nickname: authData.nickname+'님',
            }));
        });
    });
});


passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(username, password);
        if (username === authData.username) {
            // 이메일을 올바르게 입력했을 때
            console.log('1-이메일 맞음')
            if (password === authData.password) {
                //비밀번호를 올바르게 입력했을 때 (로그인 성공)
                console.log('2-아이디, 비번 맞음');
                return done(null, authData)
            } else {
                // 비밀번호를 올바르게 입력하지 않았을 때
                console.log('3-비번다름');
                return done(null, false, { message: 'password가 다릅니다.' });
            }
        } else {
            // 이메일을 올바르게 입력하지 않았을 때
            console.log('4-이메일 다름');
            return done(null, false, { message: '아이디가다릅니다.' });
        }
    }
));
app.post('/login_process', passport.authenticate('local', {
    successRedirect: '/main',
    failureRedirect: '/',
}));

app.get('/logout', (req, res, next) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        } else {
            req.session.save((err)=>{
                console.log('로그아웃됨')
                res.redirect('/');
            })
        }
    });
});

// connection.query('create table productlist (number int not null primary key, name varchar(100) not null, quantity int not null, price int not null, code varchar(100) not null, time timestamp not null)',(err,results,fields)=>{
//     if(err) throw err;
// });
// connection.query('insert into productlist values (2,"제품이름",3,40000,"123-asd78","2023-05-10")',(err,results,fields)=>{
//     if(err) throw err;
// });
// connection.query("SELECT DATE_FORMAT(time,'%Y년%m월%d일 %H시%i분%S초') AS datetime FROM productlist;",(err,results)=>{
//     if(err) throw err;
//     console.log(results);
// });



// app.get('/main', (req, res) => {
//     fs.readFile('public/list.html', 'utf-8', (err, data) => {
//         connection.query('select * from productlist', (err, results, fields) => {
//             if (err) throw err;
//             res.send(ejs.render(data, {
//                 data: results,
//             }));
//         });
//     });
// });

app.get('/create', (req, res) => {
    fs.readFile('public/input.html', 'utf-8', (err, data) => {
        res.send(data);
        if (err) throw err;
    });
});

app.post('/create', (req, res) => {
    const body = req.body;
    connection.query('insert into productlist values (?,?,?,?,?,?)', [body.number, body.name, body.quantity, body.price, body.code, body.time], (err, results, fields) => {
        res.redirect('/main');
        if (err) throw err;
    });
});

app.get('/modify/:id', (req, res) => {
    fs.readFile('public/modify.html', 'utf-8', (err, data) => {
        connection.query('select * from productlist where number = ?', [req.params.id], (err, results) => {
            if (err) throw err;
            res.send(ejs.render(data, {
                data: results[0],
            }));
        });
    });
});

app.post('/modify/:id', (req, res) => {
    const body = req.body;
    connection.query('update productlist set name=?,quantity=?,price=?,code=?,time=? where number = ?', [body.name, body.quantity, body.price, body.code, body.time, req.params.id], (err, results) => {
        res.redirect('/main');
        if (err) throw err;
    });
});

app.get('/delete/:id', (req, res) => {
    connection.query('delete from productlist where number =?', [req.params.id], (err, results) => {
        res.redirect('/main');
        if (err) throw err;
    });
});

app.get("/search", (req, res) => {
    let pathname = url.parse(req.url, true).query;
    fs.readFile('public/search.html', 'utf-8', (_err, data) => {
        connection.query("select * from productlist where name like ? or code like ? or price like ?", ['%' + pathname.query + '%','%' + pathname.query + '%','%' + pathname.query + '%'], (err, results) => {
            if (err)
                throw err;
            res.send(ejs.render(data, {
                data: results,
            }));
        });
    });
});
app.listen(3000, () => {
    console.log('Server is running');
    // connection.connect();
});