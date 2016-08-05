var mongoose = require('mongoose');
console.log('it came here');
var twilioSchema = new mongoose.Schema({
  phonenumber: {
    type: String
  },
  sent: {
    type: Number,
    default: 0
  },
  reply: {
    type: String
  }
},{
  timestamps: true
});

mongoose.model('Twilio', twilioSchema);
