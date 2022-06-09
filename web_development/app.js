const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const res = require('express/lib/response');

const app = express();
app.use(express.static('view'))
app.use(express.urlencoded({ extended: true}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data_user'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/registrasi', (req, res)=>{
    res.sendFile(path.join(__dirname, '/view/daftar/form-daftar.html'))
});

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, '/view/login/test-login-page.html'))
})

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, '/view/home/index.html'))
})



app.use('/getDatabase', (req, res)=>{
    connection.query(
        'SELECT * FROM user',
        (error, results)=>{
            res.send(JSON.stringify(results))
        }
    )
})

app.post('/inputDatabase', (req, res)=>{
    connection.query(
        'INSERT INTO user (nama, email, password, alamat) VALUES (?,?,?,?)',
        [req.body.nama, req.body.email, req.body.password, req.body.alamat],
        (error, results)=>{
            connection.query(
                'SELECT * FROM user',
                (error, results)=>{
                    console.log(results)
                }
            )
            res.redirect('/login')
        }
    )
})

app.post('/validation', (req, res)=>{
    connection.query(
        'SELECT * FROM user WHERE email = ?',
        [req.body.email],
        (error, results)=>{
            if (results[0].email == req.body.email){
                console.log(results[0].email);
                res.redirect('/home')
            }else{
                throw error;
            }
        }
    )
})

app.listen(3000);