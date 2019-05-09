const request = require('supertest');
const chai = require('chai');
const chaiHttp= require('chai-http');
var should = chai.should();

chai.use(chaiHttp);
const server = require('../server');


// function wait(ms){
//     var start = new Date().getTime();
//     var end = start;
//     while(end < start + ms) {
//         end = new Date().getTime();
//     }
// }

// describe('GET /', function () {
//         this.timeout(5000);
//         it("Main page test", function (done) {
//             wait(1000);
//             chai.request(app)
//                 .get('/')
//                 .end(function(err, response) {
//                     // console.log(response.text);
//                     expect(response).to.have.status(500);
//                     done()
//                 })
//         });
//     });

describe('Testing Page Render',function(){
    // this.timeout(5000);
    it('Port test',function(){
        chai.request(server)
        .get('/')
        .end(function(err,res){
            res.should.have.status(200);
            done();
        });
    });
    it('Login test', function(){
        chai.request(server).get('/login').end(function(err,res){
            res.should.have.status(200);
            done();
        })
    });
    it('Sign Up',function(){
        chai.request(server).get('/signup').end(function(err,res) {
            res.should.have.status(200);
            done();
        });
    });
    it('Chatroom',function() {
        chai.request(server).get('/chatroom').end(function (err, res) {
            res.should.have.status(200);
            done();
        });
    });
    it('Profile',function(){
       chai.request('http://localhost:8080/profile').get('/chatroom').end(function(err,res){
           res.should.have.status(200);
           done();
       }) ;
    });
});