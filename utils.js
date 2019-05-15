const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require("mongodb").ObjectId;
//
// module.exports.ObjectId = ObjectId;

var _db = null;
var client = null;

module.exports.getDb = function(){
    return _db;
};

module.exports.init = function(){
    const uri = 'mongodb+srv://Heroku:3wayHandsh%40ke@cluster0-ht3vg.mongodb.net/test?retryWrites=true';
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        if (err){
            return new Error('Unable to connect to DB');
        } else {
            _db = client.db("chatroom");
            console.log('Successfully connected to MongoDB server');
        }
    });
};

////////////////////////////////////////////

module.exports.close = () => {
    client.close();
    console.log('Successfully closed MongoDB connection');
};