// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('connect-mongodb-session')(session);
// const MongoStore = require('connect-mongodb-session')(session);
const hbs = require('hbs');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
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
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    name: 'mySession',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    resave: false,
    saveUninitialized: true,
    client: new MongoClient({
        uri: 'mongodb+srv://Heroku:3wayHandsh%40ke@cluster0-ht3vg.mongodb.net/test?retryWrites=true/chatroom'
    })
}));

// res.locals is an object passed to hbs engine
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

///////////////////////////////////////////////////////

app.use('/static', express.static('public'));
hbs.registerHelper('getCurrentYear', ()=>{
    return today.getFullYear();
});

// app.get('/setCookie', (req, res) => {
//     res.cookie('name', 'value').send('cookie = set');
// })

// app.get('/getCookie', (req, res) => {
//     console.log("Cookies :  ", req.cookies.name);
//     res.send('got cookie');
// })

app.get('/', (req, res)=>{
    if(req.cookies.remembered) {
        req.session.username = req.cookies.username;
        res.redirect('/chatroom');
    }
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

    db.collection('users').find({username:username}).toArray(function(err,user){
        if (err){
            res.send('Unable to find user.');
        }
        if (user.length == 0){
            res.send('Error: No user found');
        }else{
            // console.log(typeof password);
            // console.log(user[0].hash);
            if (bcrypt.compareSync(password, user[0].hash)){
                if (req.body.rememberMe === "yes"){
                    res.cookie('username', req.body.username);
                    res.cookie('remembered', true);
                } else {
                    res.cookie('username', req.body.username, {expires: new Date()});
                    res.cookie('remembered', true, {expires: new Date()});
                }
                req.session.username = user[0].username;
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
            req.session.username = user[0].username;
            res.redirect('/chatroom');
        }else{
            res.redirect('/signup/exists');
        }

    });
});

app.get('/logout', (req, res)=> {
    var index = clients.indexOf(req.session.username);
    if (index > -1) {
       clients.splice(index, 1);
    }
    res.cookie('username', req.body.username, {expires: new Date()});
    res.cookie('remembered', true, {expires: new Date()});
    req.session.destroy();
    res.redirect("/");
});

app.get('/profile/:username', function(req, res) {
    var db = utils.getDb();
    db.collection('users').find({username: req.params.username}).toArray(function(err,user){
        if (err || !(user[0])){
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

app.post('/checkreg',(req,res)=>{
    let db = utils.getDb();
    let servercheck = {};
    // console.log(req.body)
    db.collection('users').find({email: req.body.email}).toArray((err,result)=>{
        if (err) {
            res.send("An error occurred when accessing the database.");
            throw err
        }
        // console.log(result.length);
        servercheck['email'] = result.length !== 0;
        db.collection('users').find({username: req.body.name}).toArray((err,result)=>{
            if (err) {
                res.send("An error occurred when accessing the database.");
                throw err
            }
            servercheck['username'] = result.length !== 0;
            // console.log(servercheck)
            res.send(servercheck)
        })
    });
});

app.post('/checkLogin',(req,res)=>{
    let db = utils.getDb();
    // console.log(req.body)
    db.collection('users').find({username:req.body.username}).toArray(function(err,user){
        if (err){
            throw err
        }
        // console.log(user)
        if (user.length == 0){
            res.send(true);
        }else{
            // console.log(typeof password);
            // console.log(user[0].hash);
            if (bcrypt.compareSync(req.body.password, user[0].hash)){
                res.send(false);
            }else{
                res.send(true);
            }

        }

    });
});

app.get('/chatroom', (req, res)=> {
    if (!req.session.username){
        res.redirect('/')
    }else{
        clients.push(req.session.username);
        res.render('chat.hbs', {
            title: 'Chatlantis',
            page: 'Log out',
            link: '/logout',
            username: `${req.session.username}`
        });
    }
});

var chatLog = [];
var chat = io.of('/chatroom');
chat.on('connection', (socket) => {
    socket.hasName = false;
    
    socket.on('add user', async (user, colour) => {
        for (clientIndex in clients){
            if (clients[clientIndex] === user){
                socket.isClient = true;
                break;
            }
        }
        if (!socket.hasName && socket.isClient) {
            socket.username = user;
            socket.colour = colour;
            socket.hasName = true;
            msg = `<li><span style="color: #${socket.colour}"><a href=/profile/${socket.username} target="_blank" >` + socket.username + '</a></span> <span style="font-size: 85%; color: darkgrey">connected!</span></li>';
            chatLog = await msgs.logMessage("", msg);
            // console.log('displaying');
            // console.log(chatLog[chatLog.length-1])
            for (i = 0; i < chatLog.length - 1; i++){
                // console.log('next' + chatLog[i].msg)
                socket.emit('chat message', chatLog[i].msg, chatLog[i].user);
            }
            chat.emit('chat message', msg, "");
        }
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
            msgs.logMessage(socket.username, msg);
        }
        chat.emit('chat message', msg, socket.username);
    });

    socket.on('disconnect', () => {
        msg = `<li><span style="color: #${socket.colour}"><a href=/profile/${socket.username} target="_blank" >` + socket.username + '</a></span> <span style="font-size: 85%; color: darkgrey">disconnected :(</span></li>';
        if(socket.username){
            msgs.logMessage("", msg);
        }
        chat.emit('chat message', msg, "");
    });
});

http.listen(port, ()=>{
    console.log('Server is up on the port 8080');
    utils.init();
});

module.exports = app;