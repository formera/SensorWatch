angular
    .module('app')
    .factory('devicesService', ['$http', '$filter', 'appConstants', function ($http, $filter, appConstants) {

        return {
            getDeviceID: function (token, systemId) {
                var url ="";
                if (systemId === "*") {
                    url = appConstants.apiUrl + '/api/device/';
                } else {
                    url = appConstants.apiUrl + '/api/system/' + systemId + '/devices/';
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
                    var res = [];
                    for (var i = 0; i < response.data.length; i++) {
                        res.push(response.data[i].id);
                    }
                    console.log("Service - getHubData status: " + JSON.stringify(response.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getHubData status: " + JSON.stringify(res));
                    return res;
                });
            },

            getHubData: function (token, systemId) {
                var url ="";
                if (systemId === "*") {
                    url = appConstants.apiUrl + '/api/device/';
                } else {
                    url = appConstants.apiUrl + '/api/system/' + systemId + '/devices/';
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
                    console.log("Service - getHubData status: " + res.status);
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getHubData status: " + JSON.stringify(res));
                    return res;
                });
            },

            getSensorData: function (token, deviceId, sensor, dtFrom, dtTo) {
                // var d1 = new Date(dtFrom);
                // var d2 = new Date(dtTo);
                // d1.setHours(d1.getHours() - 2); // timezoneadjust'
                // d2.setHours(d2.getHours() - 2); // timezoneadjust'
                // h1 = formatDateToHours(d1);
                // h2 = formatDateToHours(d2);
                // d1 = $filter('date')(new Date(d1), 'yyyy-MM-dd');
                // d2 = $filter('date')(new Date(d2), 'yyyy-MM-dd');
                // i1 = d1 + 'T' + h1;
                // i2 = d2 + 'T' + h2;

                var url = appConstants.apiUrl + '/api/data?deviceId=' + deviceId + '&topic=' + sensor + '&from=' + dtFrom + '&to=' + dtTo;
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
                    console.log("Service - getSensorData status: " + res.status);
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getSensorData status: " + JSON.stringify(res));
                    return res;
                });
            },

            getAggregatedSensorData: function (token, deviceId, sensor, dtFrom, dtTo, aggregateTo) {

                // var url = appConstants.apiUrl + '/api/data/aggr?deviceId=59197788fc35fc2b08b9cb1f&topic=sensor1/temp&from=2017-05-23T00:00:00Z&to=2017-05-23T18:00:00Z&aggregateTo=180';
                var url = appConstants.apiUrl + '/api/data/aggr?deviceId=' + deviceId + '&topic=' + sensor + '&from=' + dtFrom + '&to=' + dtTo + '&aggregateTo=' + aggregateTo;
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
                    console.log("Service - getAggregatedSensorData status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getAggregatedSensorData status: " + JSON.stringify(res));
                    return res;
                });
            },

            getFavourites: function (token, userId) {

                var url = appConstants.apiUrl + '/api/user/' + userId + '/favorites';
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
                    console.log("Service - getFavourites status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getFavourites status: " + JSON.stringify(res));
                    return res;
                });
            },    

            getClient: function (token, systemId) {
                
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
            }                       

        };


        // function formatDateToHours(date) {
        //     return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        // };

    }])
