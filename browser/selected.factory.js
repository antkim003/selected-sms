app.factory('SelectedFactory', function($http) {
  let selectedFactoryObj = {}
  selectedFactoryObj.getTwilioData = function() {
    return $http.get('/api/twilio/')
      .then(function(response) {
        console.log('api get data response: ', response.data);
        return response.data;
      });
  };

  selectedFactoryObj.postTwilio = function(numberToSend) {
    return $http.post('/api/twilio/sms', numberToSend)
      .then(function(response) {
        console.log('api post response: ', response.data);
        return response.data
      });
  };

  return selectedFactoryObj;
})
