const request = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../server');

describe('action tests', function () {
    describe("Creating account", function () {
        let goodData = {
            username: "qwer",
            password: "uipo",
            first_name: "qwer",
            last_name: "uiop",
            email: "qwerty@uiop",
        };
        let badData = {
            username: 'navi',
            password: 'navi',
            first_name: 'navi',
            last_name: 'navi',
            email: "navi@navi"
        };
        it('should be sucessful', function (done) {
            request.agent(app).post('/signup')
                .send(goodData)
                .end((err, res) => {
                    expect('Location', '/login');
                    if (err) return done(err);
                    done();
                })
        });
        it('should be unsuccessful', function (done) {
            request.agent(app).post('/signup')
                .send(badData)
                .end((err, res) => {
                    expect('Location', '/signup/exists');
                    if (err) return done(err);
                    done();
                })
        });
    });
    describe("Logging in", function () {
        let goodData = {
            username: "navi",
            password: "navi"
        };
        let badData = {
            username: "qwer",
            password: "uiop"
        };
        it('should be successful', function (done) {
            request.agent(app).post('/login')
                .send(goodData)
                .end(function (err, res) {
                    expect("Location", "/chatroom");
                    if (err) return done(err);
                    done();
                })
        });
        it('should be unsuccessful', function (done) {
            request.agent(app).post('/login')
                .send(badData)
                .end(function (err, res) {
                    expect("Location", "/login/incorrect");
                    if (err) return done(err);
                    done();
                });
        });
    });
});



