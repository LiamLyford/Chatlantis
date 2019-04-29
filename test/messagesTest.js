const assert = require('chai').assert;
const msgs = require('../messages');

describe('Messages', () => {
    describe('createMessage()', () => {
        it('Messages should be wrapped in html', () => {
            output = '<li><span style="color: #FFFFFF"><a href=/profile/${user} target="_blank" >Jimmy</a></span> <span style="font-size: 85%; color: darkgrey">- ' + msgs.getTime() + '</span><br><span>Hello</span></li>';        
            result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.equal(result, output);
        })
    
        it('Messages should output a string', () => {
            result = msgs.createMessage('Hello', 'Jimmy', msgs.getTime(), 'FFFFFF')
            assert.typeOf(result, 'string');
        }) 
    
        it("Messages should throw an error", () => {
            assert.throws(() => {
                msgs.createMessage("", 'Jimmy', msgs.getTime(), 'FFFFFF')
            });
        })   
    });

    describe('getTime()', () => {
        
    })
    
})
