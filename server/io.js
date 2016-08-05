'use strict';
var socketio = require('socket.io');
var io = null;

function startSocketIo (server) {
    if (io) return io;

    io = socketio(server);
    console.log('socket connected to port');

    io.on('connection', function (socket) {
        socket.emit('acknowledged', {id: socket.id});
    });

    module.exports.socketio = io;

};
module.exports = {
    startSocketIo: startSocketIo
}
