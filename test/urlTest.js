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
describe('Testing Page Render', function () {
    it('/', function () {
        website.get('/').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        })
    })
    it('/login', function () {
        website.get('/login').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        })
    });
    it('/signup', function () {
        website.get('/signup').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });
    it('/chatroom', function () {
        website.get('/chatroom').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });
    it('/profile', function () {
        website.get('/profile/navi').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });
    it('/logout', function () {
        website.get('/').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        })
    })
    it('login/incorrect', function () {
        website.get('/login/incorrect').end(function (err, res) {
            expect(res).to.have.status(200);
            expect(err).to.be.null;

        });
    });
    it('login/signup/exists', function () {
        website.get('/signup/exists').end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        })
    });
});