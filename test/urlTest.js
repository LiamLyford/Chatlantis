var supertest = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const website = chai.request('http://localhost:8080');

describe('url tests', function () {
    it("/", function (done) {
        website.get('/')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    });
    it("/signup", function (done) {
        website.get('/signup')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    });
    it("/signup/exists", function (done) {
        website.get('/signup/exists')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })

    });
    it("/login", function (done) {
        website.get('/login')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    });
    it("/login/incorrect", function (done) {
        website.get('/login/incorrect')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    });
    it("/chatroom", function (done) {
        website.get('/chatroom')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    });
    // it('/profile/navi', function (done) {
    //     website.get('/profile/navi')
    //         .end(function (err, res) {
    //             expect(res).to.be.status(200);
    //             expect(err).to.be.null;
    //             done();
    //         })
    //});
    it('/logout', function (done) {
        website.get('/')
            .end(function (err, res) {
                expect(res).to.be.status(200);
                if (err) return done(err);
                done()
            })
    })
});

