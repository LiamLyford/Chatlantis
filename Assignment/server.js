const express = require('express');
// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
// const passport = require('passport');
const hbs = require('hbs');
const bcrypt = require('bcrypt-nodejs');

var utils = require('./utils');
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'thesecret',
    saveUninitialized: false,
    resave: false
}));

// app.use(passport.initialize());
// app.use(passport.session());

hbs.registerHelper('getCurrentYear', ()=>{
    return new Date().getFullYear();
});

app.get('/', (req, res)=>{
    res.render('index.hbs', {
        title: 'Home page',
        h1: 'Welcome .....',
        link1: 'Sign up',
        link2: 'Log in',
        pages: ['/signup', '/login']
    });
});

app.get('/login', (req, res)=> {
    res.render('login.hbs', {
        title: 'Login',
        h1: 'Login',
        box1: 'username',
        box2: 'password'
    });
});

app.post('/login-form', (req, res)=> {
    var username = req.body.username;
    var password = req.body.password;

    var db = utils.getDb();

    db.collection('users').find({username:req.body.username}).toArray(function(err,user){
        if (err){
            res.send('Unable to find user.');
        }
        if (user.length == 0){
            res.send('Username does not exist.');
        }else{
            // console.log(typeof password);
            // console.log(user[0].hash);
            if (bcrypt.compareSync(password, user[0].hash)){
                res.redirect('/');
            }else{
                res.send('Incorrect password.')
            }

        }

    });

});

app.get('/signup', (req, res)=> {
    res.render('signup.hbs', {
        title: 'Sign up',
        h1: 'Sign up',
        box1: 'username',
        box2: 'password',
        box3: 'email'
    });
});

app.post('/signup-form', (req, res)=> {
    //res.send(req.body);
    var username = req.body.username;
    var password = req.body.password;
    //var hash = bcrypt.hashSync(req.body.password);
    var email = req.body.email;

    var db = utils.getDb();

    db.collection('users').find({$or:[{username:username},{email:email}]}).toArray(function(err,doc){
        if (err){
            res.send('Unable to add user.');
        }
        if (doc.length == 0){
            db.collection('users').insertOne({
                username: username,
                //password: password,
                hash: bcrypt.hashSync(password),
                email: email
            });
            res.send(req.body);
        }else{
            res.send('User exists.');
        }

    });
});

app.listen(8080, ()=>{
    console.log('Server is up on the port 8080');
    utils.init();
});