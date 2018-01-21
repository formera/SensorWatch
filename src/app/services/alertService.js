angular
  .module('app')
  .factory('alertService', ['$http', 'appConstants', function ($http, appConstants) {
    return {
      get: function () {

        var jsonHost = appConstants.jsonHost;
        url = 'http://' + jsonHost + ':3000/alerts';
        return $http.get(url).then(function (response) {    //'/data/alerts.json'   
          var data = response.data;
          var status = response.status;
          var statusText = response.statusText;
          var headers = response.headers;
          var config = response.config;
          
          console.log("alertService status: " + status);
          return response.data;
        });
      }
    };
  }])    
