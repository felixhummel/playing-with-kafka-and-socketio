"use strict"

const server = require('http').createServer();
const io = require('socket.io')(server);
const Kasocki = require('kasocki');

io.on('connection', (socket) => {
    // Create a new Kasocki instance bound to the socket.
    // The socket.io client can then subscribe to topics,
    // specify filters, and start consuming.
    let kasocki = new Kasocki(socket, {
        kafkaConfig: {'metadata.broker.list': 'localhost:9092'}
    });
    kasocki.connect()
    .then(() => {
        console.log(`Kasocki ready for socket ${socket.name}`)
    });
});

server.listen(6927);
console.log('Listening for socket.io connections at localhost:6927');
