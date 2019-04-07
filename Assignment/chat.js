var testUsers = ['Cow', 'Bear', 'Pig', 'Asshat'];
var randomIndex = Math.floor(Math.random() * testUsers.length);
var thisUser = testUsers[randomIndex];

const getTime = () => {
    time = new Date();
    hours = time.getHours();
    minutes = time.getMinutes();
    ampm = (hours >= 12 ? "pm" : "am")
    if (hours > 12){hours -= 12;} 
        else if (hours === 0) {hours = 12;}
    if (minutes < 10) {minutes = "0" + minutes}
    return  (hours + ":" + minutes + ampm)
}

var socket = io();

var postMessage = () => {
    event.preventDefault();
    time = getTime();
    socket.emit('chat message', document.getElementById('m').value, thisUser, timeStamp);
    document.getElementById('m').value = '';
    return false
};

socket.on('chat message', (msg, user, msgTime) => {
    if (user === thisUser){
    message = '<li class="user">';
    } else {
    message = '<li>';
    }
    message += user + ' - ' + msgTime + '<br>' + msg + '</li>'
    document.getElementById('messages').innerHTML += message;
});
// socket.on('new connect', () => {
//   message = '<li>' + user + ' connected!' + '</li>'
//   document.getElementById('messages').innerHTML += message;
// });
// socket.on('disconnect', () => {
//   message = '<li>' + user + ' disconnected :(' + '</li>'
//   document.getElementById('messages').innerHTML += message;
// });