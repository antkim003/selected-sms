'use strict';
const express = require('express');
const chalk = require('chalk');

const server = require('http').createServer(require('./app.js'));
const PORT = process.env.PORT || 1337;
const startDb = require('./db');

// twilio implementation
// socket io implemenation
// EXTRA DB implementation
var createApplication = function () {
    require('./io').startSocketIo(server);   // Attach socket.io.
};

var startServer = function () {
    server.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });
};

startDb.connect()
    .then(createApplication)
    .then(startServer)
    .catch(function (err) {
        console.error(chalk.red(err.stack));
        process.kill(1);
});
