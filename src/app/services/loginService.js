angular
    .module('app')
    .factory('loginService', ['$http', 'appConstants', function ($http, appConstants) {
        return {
            post: function (user, pass) {
                var url = appConstants.apiUrl + '/api/auth/login';
                var config = {
                    headers: {
                        'content-type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'cache-control': 'no-cache'
                    }
                };
                data = { username: user, password: pass };
                return $http.post(url, data, config).then(function (response) {
                    var res = response;
                    res["faultedLogin"] = false;
                    console.log("loginService status: " + res.status);
                    return res;
                }, function (response) {
                    var res = response;
                    res["faultedLogin"] = true;
                    console.log("Error - loginService status: " + JSON.stringify(res));
                    return res;
                });
            }
        };
    }])
