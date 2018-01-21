angular
    .module('app')
    .controller('sensorCtrl', ['$scope', 'sensorService', 'devicesService', '$cookies', '$state', 'commonService',
        function ($scope, sensorService, devicesService, $cookies, $state, commonService) {
            if ($state.current.data.requireLogin) {
                if ($cookies.get("isAuthenticated")) {
                    // continue
                } else {
                    $state.go('login');
                }
            }

            $scope.title = "Sensor state";
            $scope.showDeviceHubs = ($cookies.get("showHubData"));
            $scope.sensorhubs = [];
            $scope.mySensors = [];
            $scope.clients = [];

            devicesService.getClient($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {
                var clients = [];
                if (response.status === 200) {
                    $scope.clients = response.data;
                    if (typeof response.data.length === "undefined") {
                        clients.push(response.data);
                    } else {
                        clients = $scope.clients;
                    }
                    $scope.clients = clients;
                    getSensorGroups(clients);
                } else {
                    console.log("CTRLR getClient ERROR: " + JSON.stringify(response));
                }
            });

            function getSensorGroups(clients) {
                devicesService.getHubData($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {
                    var mySensors = [];
                    if (response.status === 200) {
                        $scope.sensorhubs = response.data;
                        mySensors= sensorService.createSensorsGroups(response.data, clients)
                        $scope.mySensors = mySensors;
                    }
                });
            };

        }]);