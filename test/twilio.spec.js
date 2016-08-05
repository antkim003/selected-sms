const app     = require('../server/app.js');
const supertest = require('supertest');
const expect  = require('chai').expect;
const agent   = supertest(app);

describe('chai is working', function () {
  it('test', function () {
    expect(1+1).to.equal(2);
  });
});

describe('POST /api/twilio/sms', function () {
  let object = {
    phonenumber: "+16508672271"
  }

  it('success response after sending a phone number', function (done) {
    agent
      .post('/api/twilio/sms')
      .send(object)
      .expect(200)
      .end(function(err, response) {
        if (err) {done(err)}
        expect(response.text).to.eql("success");
        done();
      });
  });

  it('webhook works properly to receive replies', function () {

  });
});
