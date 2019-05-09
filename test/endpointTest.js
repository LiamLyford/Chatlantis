const chai = require('chai');
const server = require('../server');
const chaiHttp= require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('Testing Page Render',function(){
    it('Port test',function(){
        chai.request('http://localhost:8080').get('/').end(function(err,res){
            res.should.have.status(200);
        });
    });
    it('Login test', function(){
        chai.request('http://localhost:8080').get('/login').end(function(err,res){
            res.should.have.status(200);
        })
    });
    it('Sign Up',function(){
        chai.request('http://localhost:8080').get('/signup').end(function(err,res) {
            res.should.have.status(200);
        });
    });
    it('Chatroom',function() {
        chai.request('http://localhost:8080').get('/chatroom').end(function (err, res) {
            res.should.have.status(200);
        });
    });
    it('Profile',function(){
       chai.request('http://localhost:8080/profile').get('/chatroom').end(function(err,res){
           res.should.have.status(200);
       }) ;
    });
});