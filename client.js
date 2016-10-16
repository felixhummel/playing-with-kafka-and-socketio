"use strict"
var socket = require('socket.io-client')('localhost:6927', {'multiplex': false});

// attach to topic
// ===============
function ackCallback(err, res) {
    if (err) {
        console.log('Got error: ', err);
    }
    else {
        console.log('ACK from server with', res);
        // OK, ready to receive
        socket.emit('start', null);
    }
}


socket.on('err', (e) => {
    console.log('Got error from Kasocki server', e);
});

socket.on('connect', function() {
  console.log('on connect');
  let topics = ['foo']
  window.topics = topics; // DEBUG
  debugger; // wait here, then the rest works
  // TODO find out why and fix it
  // guessing "subscribe" doest not work yet
  // but "connect" should be the correct event for this
  socket.emit('subscribe', topics, ackCallback);
})

// dump all messages to console
// ============================
socket.on('message', function(message){
  console.log('Received: ', message);
});

// debug in chrome console
window.socket = socket;
window.ackCallback = ackCallback;
