var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var socketCookies = require('socket.io-cookie-parser');
var fs = require('fs'); 

app.use(cookieParser());
app.use(session({secret: 'secret'}));
io.use(socketCookies());

//FOR MULTIPLE ROOMS USE SOCKET NAME SPACES

//FOR CHAT LOGS MAKE CHAT OBJECTS FOR EACH MESSAGE

// app.use((req, res, next) => {
//   var randomIndex = Math.floor(Math.random() * testUsers.length);
//   res.cookie('name', testUsers[randomIndex], {maxAge: 900000, httpOnly: true});
//   next();
// });

// class message {
//   constructor(msg, userID, timeStamp) {
//     this.msg = msg;
//     this.userID = userID;
//     this.timeStamp = timeStamp;
//   };
// };



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// var resetLogs = () => {
//   var filestart = []
//   db = './logs.json';
//   fs.writeFileSync(db, JSON.stringify(filestart));
//   console.log("Data reset!");
// }

// resetLogs();

// var logMessage = (msg, user, time) => {
//   db = './logs.json'; 
//   logs = JSON.parse(fs.readFileSync(db)); 
//   var log = {
//     message: msg,
//     userID: user,
//     timeStamp: time
//   };
//   logs.push(log);
//   fs.writeFileSync(db, JSON.stringify(logs));
// }

io.on('connection', (socket) => {
  // user = socket.request.cookies.name;
  // console.log(socket.request.cookies.name);
  // io.emit('new connect');
  // socket.on('disconnect', () => {
  //   io.emit('disconnect');
  // });
  console.log('User connected!')
  socket.on('chat message', (msg, user, time) => {
    io.emit('chat message', msg, user, time);
    // logMessage(msg, user, time);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});