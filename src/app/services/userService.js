angular
    .module('app')
    .factory('userService', ['$http', '$filter', 'appConstants', function ($http, $filter, appConstants) {

        return {

            get: function (token, userId) {

                var url = appConstants.apiUrl + '/api/user/' + userId;
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
                    console.log("Service - getUser status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - getUser status: " + JSON.stringify(res));
                    return res;
                });
            },

            put: function (token, userId, data) {

                var url = appConstants.apiUrl + '/api/user/' + userId;
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
                    console.log("Service - putUser status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - putUser status: " + JSON.stringify(res));
                    return res;
                });
            },

            delete: function (token, uid) {
                var url = appConstants.apiUrl + '/api/user/' + uid;

                return $http({
                    method: 'DELETE',
                    url: url,
                    data: {
                        "id": uid
                    },
                    headers: {
                        'Content-type': 'application/json;charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                })
                    .then(function (response) {
                        console.log("delete User: " + JSON.stringify(response.data));
                        return response;
                    }, function (rejection) {
                        console.log("delete User ERROR: " + JSON.stringify(rejection.data));
                        return rejection;
                    });
            },

            updatePassword: function (token, userId, pwd) {

                var data = { "password": pwd };
                var url = appConstants.apiUrl + '/api/user/' + userId + '/password';
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
                    console.log("Service - putUser status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - putUser status: " + JSON.stringify(res));
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

            addFavourites: function (token, userId, devId, sensor) {

                var data = {
                    "deviceId": devId,
                    "topic": sensor
                };

                var url = appConstants.apiUrl + '/api/user/' + userId + '/favorites';
                var config = {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                };
                console.log("Service - addFavourites URL............: " + JSON.stringify(url) + ' ' + JSON.stringify(data));
                return $http.post(url, data, config).then(function (response) {
                    var res = response;
                    console.log("Service - addFavourites status: " + JSON.stringify(res.status));
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - addFavourites status: " + JSON.stringify(res));
                    return res;
                });
            },

            deleteFavourites: function (token, uid, devId, sensor) {
                var url = appConstants.apiUrl + '/api/user/' + uid + '/favorites';
                return $http({
                    method: 'DELETE',
                    url: url,
                    data: {
                    "deviceId": devId,
                    "topic": sensor
                },
                    headers: {
                        'Content-type': 'application/json;charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                })
                    .then(function (response) {
                        console.log("deleteFavourites: " + JSON.stringify(response.data));
                        return response;
                    }, function (rejection) {
                        console.log("deleteFavourites ERROR: " + JSON.stringify(rejection.data));
                        return rejection;
                    });
            },

            deleteFavourites2: function (token, userId, devId, sensor) {

                var data = {
                    "deviceId": devId,
                    "topic": sensor
                };

                var url = appConstants.apiUrl + '/api/user/' + userId + '/favorites';
                var config = {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'bearer ' + token,
                        'cache-control': 'no-cache'
                    }
                };
                console.log("deleteFavourites: " + JSON.stringify(data));
                return $http.delete(url, data, config).then(function (response) {
                    var res = response;
                    return res;
                }, function (response) {
                    var res = response;
                    console.log("Error - Service - deleteFavourites status: " + JSON.stringify(res));
                    return res;
                });
            }

        };
    }])
