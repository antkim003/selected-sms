

app.controller('SelectedCtrl', function (SelectedFactory, $scope) {
  getTwilioData();

  $scope.checker = function(reply) {
    if (reply.toLowerCase() === 'yes') {
      return 'positive';
    }
    if (reply.toLowerCase() === 'no') {
      return 'negative'
    }
    if (reply.toLowerCase() === '') {
      return ''
    }
  }
  $
  $scope.isBlank = function(reply) {
    return reply === "" ? true : false;
  }
  if(!window.socket) {
      window.socket = io();
      window.socket.on('acknowledged', function(connection) {
        console.log("Connected via socket.io (", connection.id, ")");
      });
      window.socket.on('text message received', function(message) {
        console.log('I received a reply: ', message);
        getTwilioData();
      });
      window.socket.on('updated phonenumber', function(udpatedNumber) {
        console.log('udpated phone number fired ', udpatedNumber);
        getTwilioData();
      });
      window.socket.on('new phonenumber', function(createdNumber) {
        console.log('new phone number socket ', createdNumber);
        getTwilioData();
      });
  }

  $scope.sendText = function(phoneNumberToSend) {

    if (!phoneNumberToSend.length >= 10) { return false; }
    let _phoneNumber = "+1" + phoneNumberToSend;
    console.log('adding a number ', _phoneNumber, 'typeof: ', typeof _phoneNumber);
    SelectedFactory.postTwilio({phonenumber: _phoneNumber})
      .then(function(data) {
        console.log('heres the post data!', data);
      })
      .catch(console.error);
  }

  function getTwilioData() {
    SelectedFactory.getTwilioData()
      .then(function(twilioData){
        $scope.dataHistory = twilioData
      });
  }
});
