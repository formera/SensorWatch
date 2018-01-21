angular
    .module('app')
    .controller('alertCtrl', ['$scope', 'alertService', '$cookies', '$state', function ($scope, alertService, $cookies, $state) {
      if ($state.current.data.requireLogin) {        
        if ($cookies.get("isAuthenticated")) {        
          // continue
        } else {
          $state.go('login');
        }
      } 

        var allAlerts = [];
        $scope.title = "Alerts and warnings";

        alertService.get().then(function (data) {
            $scope.user = data;
            allAlerts = data;
            $scope.totalItems = data.length;

            var cols = [{
                name: 'id',
                orderDesc: false
            }, {
                name: 'dateTime',
                orderDesc: false
            }, {
                name: 'sensorGroup',
                orderDesc: false
            }, {
                name: 'sensorName',
                orderDesc: false
            }, {
                name: 'severityStatus',
                orderDesc: false
            }, {
                name: 'sensorValue',
                orderDesc: false
            }];

            $scope.options = [5, 10, 15, 20];
            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;

            $scope.selectedRow = null;  // initialize our variable to null
            $scope.setClickedRow = function (index, myAlert) {  //function that sets the value of selectedRow to current index
                $scope.selectedRow = index;
                $scope.selectedID = myAlert.id;
                $scope.selectedSensor = myAlert.sensorName;
                $scope.selectedGroup = myAlert.sensorGroup;
                $scope.selectedSeverity = myAlert.severityStatus;
                $scope.selectedValue = myAlert.sensorValue;
                console.log(myAlert);
            }

            $scope.setSelected = function (myAlert) {
                $scope.selected = myAlert;
                console.log($scope.selected);
            };

            $scope.$watch('currentPage', function () {
                setPagingData($scope.currentPage);
            });

            function setPagingData(page) {
                $scope.currentPage = page;
                var pagedData = allAlerts.slice((page - 1) * $scope.itemsPerPage, page * $scope.itemsPerPage);
                $scope.pagedData = pagedData;
            }

            function setItemsPerPage(num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first paghe
            }

            $scope.sortData = function (sortCol) {
                // make sure it a valid column
                var column = cols.find(function (col) {
                    return col.name === sortCol;
                });

                if (!column) return;

                column.orderDesc = !column.orderDesc;

                var order = !column.orderDesc ? 1 : -1;
                allAlerts.sort(function (a, b) {
                    if (a[column.name] < b[column.name])
                        return -1 * order;
                    if (a[column.name] > b[column.name])
                        return 1 * order;
                    return 0;
                });

                setPagingData($scope.currentPage);
            };

        });

        $scope.addAlertMessage = function (item) {
            console.log("addAlertMessage:" + item);
        }
        $scope.cancelAlertMessage= function () {
            console.log("cancelAlertMessage - reload page");
        }        

    }]);