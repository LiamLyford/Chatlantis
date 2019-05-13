const chai = require('chai');
const server = require('../server');
const chaiHttp= require('chai-http');
var should = chai.should();

chai.use(chaiHttp);
var website = chai.request('http://localhost:8080');
describe('Testing Page Render',function(){
    it('Port test',function(){
        wait(1000);
        website.get('/').end(function(err,res){
            res.should.have.status(200);
        });
    });
    it('Login test', function(){
        wait(1000);
        website.get('/login').end(function(err,res){
            res.should.have.status(200);
        })
    });
    it('Sign Up',function(){
        wait(1000);
        website.get('/signup').end(function(err,res) {
            res.should.have.status(200);
        });
    });
    it('Chatroom',function() {
        wait(1000);
        website.get('/chatroom').end(function (err, res) {
            res.should.have.status(200);
        });
    });
    it('Profile',function(){
        wait(1000);
       website.get('/profile/navi').end(function(err,res){
           res.should.have.status(200);
       }) ;
    });
});
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}