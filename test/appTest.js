const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var cookie;
// const agent = require("superagent");
// const db =require.requireActual('../utils');

var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../server');

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}


describe('POST /signup', function () {
    let data = {
        "First_Name": "John",
        "Last_Name": "Mengi",
        "Email": "jmengi@lol.ke",
        "Password": "RegMengi123"
    }
    it("Account created", function (done) {
        wait(1000);
        request.agent(app).post('/signup')
            .send(data)
            .end((err, response) => {
              expect('Location', '/confirmsignup');
              if (err) return done(err);
              done()
            })
    });
});


const data = {
        "Email": "jmengi@lol.ke",
        "Password": "RegMengi123"
    }
before(function(done){
      request.agent(app)
        .post('/login')
        .send(data)
        .end(function(err){
          expect('Location', '/');
          if (err) return done(err);
          done();
        });
});
describe('POST /login', function (done) {
    it("Account exists", function (done) {
        wait(1000);
        request.agent(app).post('/login')
        done();
  });
});


describe('GET /thread_form', function () {
    this.timeout(5000);
    let threadform = {
        "Email": "jmengi@lol.ke",
        "Title": "Music",
        "Message": "Music today is lit",
        "Category": "General Music"
    };
    it("Account created", function (done) {
        wait(1000);
        request.agent(app)
            .get('/thread_form')
            .send(threadform)
            .end((err) => {
                if (err) return done(err);
                done()
            })
    });
    
});

// describe('POST /thread', function () {
//     this.timeout(5000);
//     let data = {
//         "Email": "jmengi@lol.ke",
//         "Title": "Music",
//         "Message": "Music today is lit",
//         "Category": "General Music"
//     }
//     it("Account created", function (done) {
//         wait(1000);
//         chai.request(app)
//             .post('/thread')
//             .send(data)
//             .end((err, response) => {
//                 if (err) return done(err);
//                 expect(response).to.have.status(200)
//                 done()
//             })
//     });
// });

// it('account doesnt exist', function(done){
//         request(app).get('/login')
//         // .expect('Location', '/login_form')
//         .expect(404, done);
        
//   });


describe('GET /', function () {
    this.timeout(5000);
    it("Main page test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});

describe('GET /general_music', function () {
    this.timeout(5000);
    it("General Music test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/general_music')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});

// describe('GET /latest_music', function () {
//     this.timeout(5000);
//     it("Latest Music page test", function (done) {
//         wait(1000);
//         chai.request(app)
//             .get('/latest_music')
//             .end(function(err, response) {
//                 // console.log(response.text);
//                 expect(response).to.have.status(200);
//                 done()
//             })
//     });
// });

describe('GET /create_post', function () {
    this.timeout(5000);
    it("Crete Post test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/create_post')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});

describe('GET /signup', function () {
    this.timeout(5000);
    it("Sign up test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/signup')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});




describe('GET /confirmsignup', function () {
    this.timeout(5000);
    it("confirm page test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/confirmsignup')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});

describe('GET /login', function () {
    this.timeout(5000);
    it("Main page test", function (done) {
        wait(1000);
        chai.request(app)
            .get('/login')
            .end(function(err, response) {
                expect(response).to.have.status(200);
                if (err) return done(err);
                done()
            })
    });
});

