var mongoose = require('mongoose');
var Promise = require('bluebird');
var path = require('path');

require('./models/twilio.js');

var _conn;
var DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI;

mongoose.Promise = Promise;

function connect () {
	if (_conn)
		return _conn
	_conn = new Promise(function (resolve, reject) {
		mongoose.connect(DATABASE_URI, function (err){
			if(err)
				return reject(err);
			console.log('monogoose connection open to: ', DATABASE_URI);
			resolve(mongoose.connection);
		});
	});
	return _conn;
}

module.exports = {
  connect: connect
}
