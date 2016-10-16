var socket = require('socket.io-client')('localhost:6927');

// Log errors and responses from socket.io event callbacks.
function ackCallback(err, res) {
    if (err) {
        console.log('Got error: ', err);
    }
    else {
        console.log('ACK from server with', res);
    }
}


// Subscribe to some topics.
let topics = [
     // subscribe to mytopic1 and mytopic2 starting at latest offset in each
    'mytopic1',
    'mytopic2'
]
socket.emit('subscribe', topics, ackCallback);

// Consume 3 messages, receiving them via ackCallback.
console.log("socket.emit('consume', null, ackCallback);");
