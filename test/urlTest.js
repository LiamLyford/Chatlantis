var supertest = require('supertest');
const express = require('express');
const chai = require('chai');
const uuid = require('uuid');
const request = require('supertest');
const chaiHttp = require('chai-http');
const app = express();
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
const website = chai.request('http://localhost:8080');
describe('Testing Page Render',function(){
    it('index',function(){
       website.get('/').end(function(err,res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
       })
    })
    it('Login test', function(){
        website.get('/login').end(function(err,res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        })
    });
    it('Sign Up',function(){
        website.get('/signup').end(function(err,res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });
    it('Chatroom',function() {
        website.get('/chatroom').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });
    it('Profile',function(){
        website.get('/profile/navi').end(function(err,res){
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        }) ;
    });
});