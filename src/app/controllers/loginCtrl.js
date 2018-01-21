angular
  .module('app')
  .controller('loginCtrl', ['$scope', 'loginService', '$state', '$cookies', '$window', function ($scope, loginService, $state, $cookies, $window) {
    $scope.title = "User login";
    $scope.apidata = undefined;
    // $scope.username = 'formeraroot';
    // $scope.password = 'zxasqw!"12';

    $scope.userLogin = function () {

      loginService.post($scope.username, $scope.password).then(function (response) {
        $scope.apidata = response;
        if ($scope.apidata.status === 200) {
          var expireTime = new Date();
          expireTime.setDate(expireTime.getDate() + 1); //Add 24 hour
          $cookies.put('accessToken', $scope.apidata.data.accessToken, {
            expires: expireTime  
          });
          $cookies.put('isAuthenticated', true, {
            expires: expireTime  
          });
          $cookies.put('systemId', $scope.apidata.data.system, {
            expires: expireTime  
          });    
          $cookies.put('userId', $scope.apidata.data.user, {
            expires: expireTime  
          });
          $cookies.put('showHubData', "false", {
            expires: expireTime  
          });                                       
          $state.go('dashboard');

        } else {
          console.log("API status ERROR: " + JSON.stringify($scope.apidata.status));
        }
      });
    };


  }]);



