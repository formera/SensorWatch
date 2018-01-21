angular
    .module('app')
    .factory('clientService', ['$http', '$filter', 'appConstants', function ($http, $filter, appConstants) {

        return {

            get: function (token, systemId) {
                
                var url ="";
                if (systemId === "*") {
                    url = appConstants.apiUrl + '/api/client/'
                } else {
                    url = appConstants.apiUrl + '/api/client/' + systemId;
                };                

                var config = {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                };

                return $http.get(url, config).then(function (response) {
                    var res = response;
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getClient status: " + JSON.stringify(res));
                    return res;
                });
            },  
            
             put: function (token, systemId, data) {

                var url = appConstants.apiUrl + '/api/client/' + systemId;
                var config = {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                };

                return $http.put(url, data, config).then(function (response) {
                    var res = response;
                    console.log("Service - putClient status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - putClient status: " + JSON.stringify(res));
                    return res;
                });
            }, 
  
        };


    }])
