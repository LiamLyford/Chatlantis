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
const port = process.env.PORT || 8080;

var utils = require('./utils');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var today = new Date();

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
    return today.getFullYear();
});

app.get('/', (req, res)=>{
    res.render('index.hbs', {
        title: 'Home page',
        h1: 'Welcome .....',
        link1: 'Sign up',
        link2: 'Log in',
        link3: 'Chatroom',
        link4: 'Log out',
        pages: ['/signup', '/login', '/chatroom', '/logout']
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
                req.session.user = user;
                res.redirect('/chatroom');
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
                email: email,
                registration_date: today
            });
            // res.send(req.body);
            res.redirect('/login');
        }else{
            res.send('User already exists.');
        }

    });
});

app.get('/chatroom', (req, res)=> {
    if (!req.session.user){
        res.send('You have not logged in.')
    }else{
        res.render('chat.hbs', {
            title: 'Chatlantis',
            page: 'Log out',
            link: '/logout',
            username: `${req.session.user[0].username}`
        });
    }
});

var chat = io.of('/chatroom');
chat.on('connection', (socket) => {
    // user = socket.request.cookies.name;
    // console.log(socket.request.cookies.name);
    // io.emit('new connect');
    socket.on('disconnect', () => {
    //   io.emit('disconnect');
        console.log('User disconnected :(');
    });
    console.log('User connected!')
    socket.on('chat message', (msg, user, time) => {
        // console.log(req.session.user);
        chat.emit('chat message', msg, user, time);
    });
});

app.get('/logout', (req, res)=> {
    req.session.destroy();
    res.send("You've logged out.")
});

http.listen(port, ()=>{
    console.log('Server is up on the port 8080');
    utils.init();
});