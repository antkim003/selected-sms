'use strict';
const router = require('express').Router();

router.use('/twilio', require('./twilio.js'));

module.exports = router;
