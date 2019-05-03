const assert = require('chai').assert;
var utils = require('../utils');
const msgs = require('../messages');

describe('Messages', () => {
    describe('createMessage()', () => {
        it('createMessage should wrap a message in html', () => {
            output = '<li><span style="color: #FFFFFF"><a href=/profile/${user} target="_blank" >Jimmy</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgs.getTime() + '</span><br><span>Hello</span></li>';        
            result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.equal(result, output);
        })
    
        it('createMessage should output a string', () => {
            result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.typeOf(result, 'string');
        }) 
    
        it("createMessage should throw an error if message is empty", () => {
            assert.throws(() => {
                msgs.createMessage("", 'Jimmy', msgs.getTime(), 'FFFFFF')
            });
        })   
    });

    describe('getTime()', () => {
        it("getTime should return a string", () => {
            assert.typeOf(msgs.getTime(), 'string');
        })
    })

    describe('logMessage()', () => {
        it("logMessage should return an array", async () => {
            utils.init();
            await sleep();
            db = utils.getDb();
            testMsg = msgs.createMessage('test', 'test', 'test', 'F77777');
            result = await msgs.logMessage('test', testMsg);
            // db.collection('log').deleteOne({username: 'test'});
            utils.close();
            assert.typeOf(result, 'array');
        })
        it("logMessage should add a message to the end of the array", async () => {
            utils.init();
            await sleep();
            db = utils.getDb();
            testMsg = msgs.createMessage('test', 'test', 'test', 'F77777');
            result = await msgs.logMessage('test', testMsg);
            // db.collection('log').deleteOne({username: 'test'});
            utils.close();
            assert.equal(result[198].msg, testMsg)
        })
    })
    
})

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
