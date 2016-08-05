'use strict';

const request = require('request');
const path = require('path');
const keys = require(path.join(__dirname, '../../../keys.json'));
const router = require('express').Router();
const twilio = require('twilio');
const client = require('twilio')(keys.accountsid, keys.authtoken);
const socketio = require('../../io.js');
const Twilio = require('mongoose').model('Twilio');
const Promise = require('bluebird');
Twilio.promise = Promise;

router.get('/', function(req,res,next) {
  Twilio.find({})
    .then(function(data) {
      res.json(data)
    })
    .catch(function(err) {
      console.error(err);
      res.json(err);
    });
});

router.post('/sms', function(req, res, next) {
  //Send an SMS text message
  client.sendMessage({
      to: req.body.phonenumber, // Any number Twilio can deliver to
      from: '+19179246104', // A number you bought from Twilio and can use for outbound communication
      body: 'Good news! Selected is interested in you! Reply with YES to proceed, or NO to decline' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (err) {
        res.status(err.status).send(err.message);
        next();
      }
      Twilio.findOne({phonenumber: req.body.phonenumber})
        .then(function(data) {
          console.log('tried to find data: ', data);
          if(!data) {
            console.log('the check worked');
            return Twilio.create({
              phonenumber: req.body.phonenumber,
              sent: 1,
              reply: ''
            })
          } else {
            data.sent++;
            data.reply = '';
            console.log('data: ', data);
            return data.save();
          }
        })
        .then(function(createdNumber) {
          if(createdNumber._id) {
            socketio.socketio.emit('new phonenumber', createdNumber);
            console.log('number was created', createdNumber);
          }
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          console.error(err);
          res.status(400).json(err);
        });
  });
});


// test route
router.get('/received', function(req, res) {
  socketio.socketio.emit('text message received', {hello: 'hello'})
  res.send('message received');
});

router.post('/sms/receive', twilio.webhook({
  url: 'https://selected-sms.herokuapp.com/api/twilio/sms/receive'
}), function(request, response) {
  let twiml = new twilio.TwimlResponse();
  console.log('request.body', request.body.Body, request.body.From);

  Twilio.findOne({phonenumber: request.body.From})
    .then(function(phone) {
      console.log('phone ', phone);
      if (!phone) return;
      if (request.body.Body.toLowerCase() === 'no') {
          twiml.message('Sorry to see you go!');
          phone.reply = request.body.Body;
      }
      if (request.body.Body.toLowerCase() === 'yes') {
          twiml.message('Thank you for submitting!');
          phone.reply = request.body.Body;
      }
      return phone.save();
    })
    .then(function(saved) {
      console.log('saved data: ', saved);
      socketio.socketio.emit('text message received', request.body.Body);
      response.send(twiml);
    })
    .catch(console.error);
})


module.exports = router;
