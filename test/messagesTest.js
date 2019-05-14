const assert = require('chai').assert;
var utils = require('../utils');
const msgs = require('../messages');

describe('Messages', () => {
    describe('createMessage()', () => {
        it('createMessage should wrap a message in html', () => {
            var output = '<li><span style="color: #FFFFFF"><a href=/profile/Jimmy target="_blank" >Jimmy</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgs.getTime() + '</span><br><span>Hello</span></li>';        
            var result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.strictEqual(result, output);
        })
    
        it('createMessage should output a string', () => {
            var result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            // var result = 1;
            assert.typeOf(result, 'string');
        }) 
    
        it("createMessage should throw an error if message is empty", () => {
            assert.throws(() => {
                msgs.createMessage("", 'Jimmy', msgs.getTime(), 'FFFFFF')
            });
        })
        it("createMessage should remove html tags before wrapping the message", () => {
            var output = '<li><span style="color: #FFFFFF"><a href=/profile/Jimmy target="_blank" >Jimmy</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgs.getTime() + '</span><br><span>Hello</span></li>';        
            var result = msgs.createMessage('<script>Hello</script>', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.strictEqual(result, output);
        })
        it("createMessage should convert emojis", () => {
            var output = '<li><span style="color: #FFFFFF"><a href=/profile/Jimmy target="_blank" >Jimmy</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgs.getTime() + '</span><br><span>🍕</span></li>';        
            var result = msgs.createMessage(':pizza:', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.strictEqual(result, output);
        })    
    });
    
    describe('getTime()', () => {
        it("getTime should return a string", () => {
            assert.typeOf(msgs.getTime(), 'string');
        })
    })

    // describe('logMessage()', () => {
    //     it("logMessage should return an array", async () => {
    //         utils.init();
    //         await sleep();
    //         db = utils.getDb();
    //         testMsg = msgs.createMessage('test', 'test', 'test', 'F77777');
    //         result = await msgs.logMessage('test', testMsg);
    //         // db.collection('log').deleteOne({username: 'test'});
    //         assert.typeOf(result, 'array');
    //     })
    //     it("logMessage should add a message to the end of the array", async () => {
    //         db = utils.getDb();
    //         testMsg = msgs.createMessage('test', 'test', 'test', 'F77777');
    //         result = await msgs.logMessage('test', testMsg);
    //         // db.collection('log').deleteOne({username: 'test'});
    //         utils.close();
    //         assert.equal(result[result.length-1].msg, testMsg)
    //     })
    // })
    
})

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
