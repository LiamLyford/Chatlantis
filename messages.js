var getTime = () => {
    time = new Date();
    hours = time.getHours();
    minutes = time.getMinutes();
    ampm = (hours >= 12 ? "pm" : "am")
    if (hours > 12){hours -= 12;} 
        else if (hours === 0) {hours = 12;}
    if (minutes < 10) {minutes = "0" + minutes}
    return  (hours + ":" + minutes + ampm)
};

var encodeMessage = (msg) => {
    // msg = msg.replace(/</gi, "&lt;");
    // msg = msg.replace(/>/gi, "&gt;");
    // msg = msg.replace(/&/gi, "&amp;");
    // msg = msg.replace(/"/gi, "&quot;");
    // msg = msg.replace(/'/gi, "&#039;");
    // msg = msg.replace(/\\/gi, "&#092;");
    msg = msg.replace(/(<([^>]+)>)/ig,"")
    return msg
}

var createMessage = (msg, user, msgTime, colour) => {
    msg = encodeMessage(msg);
    if (msg === "") {
        throw new Error("*** I tried to hack the server ***");
    }
    output = `<li><span style="color: #${colour}"><a href=/profile/${user} target="_blank" >` + user + '</a></span> - ' + msgTime + '<br>' + '<span>' + msg + '</span></li>';
    return output
}

module.exports = {
    createMessage,
    getTime
}