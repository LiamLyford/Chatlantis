const emoji = require('node-emoji');
var utils = require('./utils');

var getTime = () => {
    time = new Date();
    date = time.toDateString();
    date = date.slice(4).replace(/\ /ig, "/");
    hours = time.getHours();
    minutes = time.getMinutes();
    ampm = (hours >= 12 ? "pm" : "am");
    if (hours > 12){hours -= 12;} 
        else if (hours === 0) {hours = 12;}
    if (minutes < 10) {minutes = "0" + minutes}
    return  (date + ', ' + hours + ":" + minutes + ampm)
};


var stripMessage = (msg) => {
    // msg = msg.replace(/</gi, "&lt;");
    // msg = msg.replace(/>/gi, "&gt;");
    // msg = msg.replace(/&/gi, "&amp;");
    // msg = msg.replace(/"/gi, "&quot;");
    // msg = msg.replace(/'/gi, "&#039;");
    // msg = msg.replace(/\\/gi, "&#092;");
    msg = msg.replace(/(<([^>]+)>)/ig,"");
    return msg
};

var createMessage = (msg, user, msgTime, colour) => {
    msg = stripMessage(msg);
    msg = emoji.emojify(msg);
    // console.log('creating message');
    // console.log(msg);
    if (msg === "") {
        throw new Error("*** I tried to hack the server ***");
    }
    output = `<li><span style="color: #${colour}"><a href=/profile/${user} target="_blank" >` + user + '</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgTime + '</span><br><span>' + msg + '</span></li>';
    return output
};

const MAXLOGS = 100;
var logMessage = (user, msg) => {
    return new Promise((resolve) => {
        var db = utils.getDb();
        db.collection('log').insertOne({
                user: user,
                msg: msg
        });
        db.collection('log').find({}).toArray(function(err,log){
            if (err){
                res.send('Problem loading chat log.');
                resolve({
                    user: 'server',
                    msg: 'Problem loading chat log.'
            });
            }else{
                if (log.length >= MAXLOGS) {
                    db.collection('log').deleteOne();
                    log.shift();
                }
                // console.log('logging');
                resolve(log)
            }
        });
    });
};

// console.log(emoji.emojify(':pizza:'))

module.exports = {
    createMessage,
    logMessage,
    getTime
};