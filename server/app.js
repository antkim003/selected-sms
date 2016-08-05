'use strict';
const express = require('express');
const path = require('path');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const db = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// static files
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/semantic', express.static(path.join(__dirname, '../semantic')));
app.use(express.static(path.join(__dirname, '../browser')));

// api routes
app.use('/api', require('./routes/api'));

// loading single page app
app.use('/*', (req,res,next) => {
  res.sendFile(path.join(__dirname,'../browser/index.html'));
});

module.exports = app;
