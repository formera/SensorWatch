angular
  .module('app')
  .controller('userCtrl', ['$scope', '$window', 'userService', '$cookies', '$state', 'devicesService',
    function ($scope, $window, userService, $cookies, $state, devicesService) {

      if ($state.current.data.requireLogin) {
        if ($cookies.get("isAuthenticated")) {
          // continue
        } else {
          $state.go('login');
        }
      }

      $scope.title = "User administration and settings";
      $scope.sensorhubs = [];
      $scope.mySensors = [];
      $scope.favourites = [];
      $scope.options = [5, 8, 12];
      $scope.itemsPerPage = 5;
      $scope.totalItems = undefined;
      $scope.currentPage = 1;

      $scope.newPassword = undefined;
      $scope.confirmPassword = undefined;

      userService.get($cookies.get("accessToken"), $cookies.get("userId")).then(function (response) {
        $scope.userdata = response;
        $scope.user = response.data;
        if ($scope.userdata.status === 200) {
          $scope.isDisabled = !$scope.user.admin;
        } else {
          console.log("CTRLR getHubData ERROR: " + JSON.stringify($scope.userdata));
        }
      });


      devicesService.getFavourites($cookies.get("accessToken"), $cookies.get("userId")).then(function (response) {
        if (response.status === 200) {
          $scope.favourites = response.data;
          initAddFavourites($scope.favourites);
        } else {
          console.log("CTRLR getFavourites ERROR: " + JSON.stringify(response));
        }
      });

      function initAddFavourites(favourites) {
        devicesService.getHubData($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {

          if (response.status === 200) {
            $scope.sensorhubs = response.data;
            createMySensors(response.data, favourites)

          } else {
          }
        });

      };

      function createMySensors(hubdata, favourites) {
        var mySensors = [];
        var isInFav = null;
        for (var i = 0; i < hubdata.length; i++) { //for each hub
          for (var ii = 0; ii < hubdata[i].topics.length; ii++) {  // for each sensor in hubs
            isInFav = isInFavourites(favourites, hubdata[i].id + "/" + hubdata[i].topics[ii].id);

            mySensors.push({
              id: hubdata[i].id + "/" + hubdata[i].topics[ii].id,
              deviceId: hubdata[i].id,
              topic: hubdata[i].topics[ii].id,
              name: hubdata[i].topics[ii].name,
              type: hubdata[i].topics[ii].type,
              value: hubdata[i].topics[ii].value,
              isFavourite: isInFav //
            });
          }
        }
        $scope.totalItems = mySensors.length;
        $scope.mySensors = mySensors;
        $scope.$watch('currentPage', function () {
          setPagingData($scope.currentPage);
        });

        function setPagingData(page) {
          $scope.currentPage = page;

          var pagedData = mySensors.slice((page - 1) * $scope.itemsPerPage, page * $scope.itemsPerPage);
          $scope.pagedData = pagedData;
          // console.log("CTRLR setPagingData: " + JSON.stringify(pagedData));
        }
      }

      function isInFavourites(favourites, sensorId) {

        var favId = "";
        for (var i = 0; i < favourites.length; i++) { //for each hub
          favId = favourites[i].deviceId + "/" + favourites[i].topic;
          if (favId == sensorId) {
            return true;
          }
        }
        return false;
      }

      $scope.editFavourites = function (index, sel) {

        if (sel.isFavourite == true) {
          console.log("editFavourites: " + JSON.stringify(sel) + 'DEL');
          userService.deleteFavourites($cookies.get("accessToken"), $cookies.get("userId"), sel.deviceId, sel.topic).then(function (response) {
            if (response.status === 200) {
              sel.isFavourite = !sel.isFavourite;
            } else {
              console.log("delete Fav ERROR: " + JSON.stringify(response.status));
            }
          })
        } else {
          console.log("editFavourites: " + JSON.stringify(sel) + 'POST');
          userService.addFavourites($cookies.get("accessToken"), $cookies.get("userId"), sel.deviceId, sel.topic).then(function (response) {
            if (response.status === 200) {
              sel.isFavourite = !sel.isFavourite;
            } else {
              console.log("add Fav ERROR: " + JSON.stringify(response.status));
            }
          });
        }
      };

      function setItemsPerPage(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
      }

      $scope.selectedRow = null;  // initialize our variable to null
      // $scope.setClickedRow = function (index, sel) {  //function that sets the value of selectedRow to current index
      //   $scope.selectedRow = index;
      //   $scope.selectedID = sel.id;
      //   $scope.selectedSensor = sel.sensorName;
      //   $scope.sensorValue = sel.sensorValue;
      //   console.log("ClickedSensor: ID " + $scope.selectedID + ' ' + $scope.sensorValue);
      // }

      $scope.updateUserPassword = function () {
        if ($scope.newPassword === $scope.confirmPassword) {
          $scope.passwordMatch = true;
          userService.updatePassword($cookies.get("accessToken"), $cookies.get("userId"), $scope.newPassword).then(function (response) {
            if (response.status === 200) {
              $window.location.reload();
            } else {
              console.log("updateUserPassword ERROR: " + JSON.stringify(response.status));
            }
          });
        } else {
          $scope.passwordMatch = false;
        }
      }

      $scope.editPassword = function () {
        $scope.passwordMatch = true;
      }

      $scope.cancelUserPassword = function () {
        $window.location.reload();
      }

      $scope.saveUser = function () {
        userService.put($cookies.get("accessToken"), $cookies.get("userId"), $scope.user).then(function (response) {
          $scope.apidata = response;
          if ($scope.apidata.status === 200) {
          } else {
            console.log("API status ERROR: " + JSON.stringify($scope.apidata.status));
          }
        });
      }

      $scope.deleteUser = function () {
        userService.delete($cookies.get("accessToken"), $cookies.get("userId")).then(function (response) {
          $scope.apidata = response;
          if ($scope.apidata.status === 200) {
            console.log("CTRLR deleteUser: " + JSON.stringify($scope.apidata.status));
            $window.location.reload();
          } else {
            console.log("CTRLR deleteUsers ERROR: " + JSON.stringify($scope.apidata.status));
          }
        });
      }


      $scope.cancelSaveUser = function () {
        $window.location.reload();
      }

    }]);