// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const hbs = require('hbs');
const bcrypt = require('bcrypt-nodejs');
const port = process.env.PORT || 8080;


var utils = require('./utils');
var msgs = require('./messages');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var today = new Date();
var clients = [];

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
app.use('/static', express.static('public'));
hbs.registerHelper('getCurrentYear', ()=>{
    return today.getFullYear();
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
        box2: 'password',
        pages: ['/signup',  '/'],
        isError: 'false',
        error: ''
    });
});

app.get('/login/incorrect', (req, res)=> {
    res.render('login.hbs', {
        title: 'Login',
        h1: 'Login',
        box1: 'username',
        box2: 'password',
        pages: ['/signup',  '/'],
        isError: 'true',
        error: 'Incorrect login information.'
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
            res.redirect('/login/incorrect');
        }else{
            // console.log(typeof password);
            // console.log(user[0].hash);
            if (bcrypt.compareSync(password, user[0].hash)){
                req.session.user = user;
                res.redirect('/chatroom');
            }else{
                res.redirect('/login/incorrect');
            }

        }

    });

});

app.get('/signup', (req, res)=> {
    res.render('signup.hbs', {
        title: 'Sign up',
        h1: 'Sign up',
        box1: 'username',
        box2: 'first_name',
        box3: 'last_name',
        box4: 'password',
        box5: 'email',
        pages: ['/login',  '/'],
        isError: 'false',
        error: ''
    });
});

app.get('/signup/exists', (req, res)=> {
    res.render('signup.hbs', {
        title: 'Sign up',
        h1: 'Sign up',
        box1: 'username',
        box2: 'first_name',
        box3: 'last_name',
        box4: 'password',
        box5: 'email',
        pages: ['/login',  '/'],
        isError: 'true',
        error: 'User already exists.'
    });
});

app.post('/signup-form', (req, res)=> {
    //res.send(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
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
                hash: bcrypt.hashSync(password),
                first_name: first_name,
                last_name: last_name,
                email: email,
                registration_date: today
            });
            res.redirect('/login');
        }else{
            res.redirect('/signup/exists');
        }

    });
});

app.get('/logout', (req, res)=> {
    var index = clients.indexOf(req.session.user[0].username);
    if (index > -1) {
       clients.splice(index, 1);
    }
    req.session.destroy();
    res.redirect("/");
});

app.get('/profile/:username', function(req, res) {
    var db = utils.getDb();
    db.collection('users').find({username: req.params.username}).toArray(function(err,user){
        if (err){
            res.send('User does not exist.');
        }else{
            res.render('profile.hbs', {
                title: 'Profile',
                username: user[0].username,
                name: user[0].first_name + " " + user[0].last_name,
                email: user[0].email,
                link:'/'
            });
        }

    });
});

app.get('/chatroom', (req, res)=> {
    if (!req.session.user){
        res.redirect('/login')
    }else{
        clients.push(req.session.user[0].username);
        res.render('chat.hbs', {
            title: 'Chatlantis',
            page: 'Log out',
            link: '/logout',
            username: `${req.session.user[0].username}`
        });
    }
});

var chatLog = []
const MAXLOGS = 200;
var logMessage = (user, msg) => {
    var db = utils.getDb();
    db.collection('log').insertOne({
            user: user,
            msg: msg
    })
    db.collection('log').find({}).toArray(function(err,log){
        if (err){
            res.send('Problem loading chat log.');
        }else{
            if (log.length >= MAXLOGS) {
                db.collection('log').deleteOne();
                log.shift();
            }
            chatLog = log;
        }
    });
}

var chat = io.of('/chatroom');
chat.on('connection', (socket) => {
    socket.hasName = false;

    socket.on('add user', (user, colour) => {
        for (clientIndex in clients){
            if (clients[clientIndex] === user){
                socket.isClient = true;
                break;
            }
        }
        if (!socket.hasName && socket.isClient) {
            socket.username = user;
            socket.colour = colour;
            socket.hasName = true
            for (i = 0; i < chatLog.length; i++){
                socket.emit('chat message', chatLog[i].msg, chatLog[i].user);
            }
            msg = `<li><span style="color: #${socket.colour}"><a href=/profile/${socket.username} target="_blank" >` + socket.username + '</a></span> <span style="font-size: 85%; color: darkgrey">connected!</span></li>';
            logMessage("", msg);
            chat.emit('chat message', msg, "");
        };
    });

    socket.on('chat message', (msg) => {
        if(!socket.username){
            socket.username = "L337NATION";
            socket.colour = 'e914c6';
            socket.hasName= false;
        }
        time = msgs.getTime();
        try {
            msg = msgs.createMessage(msg, socket.username, time, socket.colour);
        } catch (err) {
            msg = msgs.createMessage(err.message, socket.username, time, socket.colour);
        }
        if (socket.username != "L337NATION"){
            logMessage(socket.username, msg);
        }
        chat.emit('chat message', msg, socket.username);
    });

    socket.on('disconnect', () => {
        msg = `<li><span style="color: #${socket.colour}"><a href=/profile/${socket.username} target="_blank" >` + socket.username + '</a></span> <span style="font-size: 85%; color: darkgrey">disconnected :(</span></li>';
        logMessage("", msg);
        chat.emit('chat message', msg, "");
    });
});

http.listen(port, ()=>{
    console.log('Server is up on the port 8080');
    utils.init();
});