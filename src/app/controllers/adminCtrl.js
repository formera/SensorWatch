angular
    .module('app')
    .controller('adminCtrl', ['$scope', 'clientService', '$window', 'sensorService', 'commonService', '$cookies', '$state', 
    function ($scope, clientService, $window, sensorService, commonService, $cookies, $state) {
        if ($state.current.data.requireLogin) {
            if ($cookies.get("isAuthenticated")) {
                // continue
            } else {
                $state.go('login');
            }
        }

        var allSensors = [];
        $scope.title = "Administration and settings";
        $scope.newGroupItem = [];
        $scope.newGroupItem.description = "";
        $scope.newGroupItem.type = "";
        $scope.selectedGroup = undefined;
        $scope.options = [5, 10, 15, 20];
        $scope.itemsPerPage = 10;
        $scope.showDeviceHubsOptions = [{ id: 1, value: "true" }, { id: 2, value: "false" }];
        if (commonService.isNumeric($cookies.get("aggrDashboardChart")) === true) {
            $scope.aggrDashboardChart = $cookies.get("aggrDashboardChart");
        } else {
            $scope.aggrDashboardChart = 180;
        };

        if (($cookies.get("showHubData")) === "true") {  //TODO handle from API
            $scope.selectedOption = { id: 1, value: "true" };
        } else {
            $scope.selectedOption = { id: 2, value: "false" };
        };

        clientService.get($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {
            var clients = [];
            if (response.status === 200) {
                $scope.clients = response.data;
                if (typeof $scope.clients.length === "undefined") {
                    clients.push($scope.clients);
                    $scope.clients = clients;
                };
                $scope.clientsCount = commonService.getLength($scope.clients);
                $scope.selectedClient = $scope.clients[0];
                // console.log("CTRLR getClient: " + JSON.stringify($scope.clients[0]));
            } else {
                console.log("CTRLR getClient ERROR: " + JSON.stringify(response));
            }
        });

        $scope.setDeviceHubs = function (sel) { //TODO save to API
            var expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 1); //Add 24 hour
            $cookies.remove('showHubData');
            $cookies.put('showHubData', $scope.selectedOption.value, {
                expires: expireTime
            });
        }

        $scope.setAggrDashboardChart = function () {
            console.log("$scope.aggrDashboardChart: " + $scope.aggrDashboardChart);
            var expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 1); //Add 24 hour
            $cookies.put('aggrDashboardChart', $scope.aggrDashboardChart, {
                expires: expireTime
            });
        };


        $scope.addGroup = function (newGroupItem) {
            console.log("addGroup:" + newGroupItem.description + ' ' + newGroupItem.type);
        }
        // $scope.cancelGroup = function () {
        //     console.log("cancelGroup - reload page");
        // }

        $scope.selectGroup1 = function (index, sel) { //TODO save to API
            // console.log("CTRLR removeGroup: " + JSON.stringify(sel[index].name));  
            console.log("CTRLR selectGroup: " + JSON.stringify(index));
            $scope.selectedGroupIndex = index;
        }

        $scope.removeGroup = function (sel) {
            console.log("removeGroup: " + JSON.stringify($scope.selectedGroupIndex));
        }
        $scope.editGroup = function () {
            console.log("Edit ID: " + $scope.dropselectedItem.id);
        }

        $scope.editClient = function (sel) {
            $scope.selectedClient = sel;
            console.log("editClient " + JSON.stringify(sel));
        }
        $scope.saveClient = function () {
            var systemId = $scope.selectedClient.id;
            console.log("systemId" + systemId);
            clientService.put($cookies.get("accessToken"), systemId, $scope.selectedClient).then(function (response) {
                if (response.status === 200) {
                    console.log("saveClient " + JSON.stringify(response));
                    $window.location.reload();
                } else {
                    console.log("saveClient ERROR: " + JSON.stringify($scope.apidata.status));
                }
            });
        };

        // $scope.saveClient = function () {
        //     var systemId = $scope.selectedClient.id;
        //     clientService.put($cookies.get("accessToken"), systemId, $scope.selectedClient).then(function (response) {
        //     $scope.apidata = response;
        //     if ($scope.apidata.status === 200) {
        //       $window.location.reload();
        //     } else {
        //       console.log("API status ERROR: " + JSON.stringify($scope.apidata.status));
        //     }
        //   });
        // }


        $scope.cancelSaveClient = function () {
            $window.location.reload();
        }


        $scope.saveUser = function () {
            var systemId = $scope.selectedClient.id;
            clientService.put($cookies.get("accessToken"), systemId).then(function (response) {
                if (response.status === 200) {
                    $window.location.reload();
                } else {
                    console.log("API status ERROR: " + JSON.stringify($scope.apidata.status));
                }
            });
        }


        // sensorService.get().then(function (data) {
        //     allSensors = data;
        //     $scope.totalItems = data.length;
        //     $scope.currentPage = 1;
        //     //console.log("Data: " + data[0].sensorGroup[0].description);
        //     //console.log("Datalength: " + data.length);
        // });

        // $scope.$watch('currentPage', function () {
        //     setPagingData($scope.currentPage);
        // });

        // function setPagingData(page) {
        //     $scope.currentPage = page;
        //     var pagedData = allSensors.slice((page - 1) * $scope.itemsPerPage, page * $scope.itemsPerPage);
        //     //console.log("allSensors: " + allSensors);
        //     //console.log("pagedData: " + pagedData);
        //     $scope.pagedData = pagedData;
        // }

        // function setItemsPerPage(num) {
        //     $scope.itemsPerPage = num;
        //     $scope.currentPage = 1; //reset to first paghe
        // }

        // var cols = [{
        //     name: 'id',
        //     orderDesc: false
        // }, {
        //     name: 'sensorName',
        //     orderDesc: false
        // }, {
        //     name: 'sensorGroup',
        //     orderDesc: false
        // }, {
        //     name: 'minValue',
        //     orderDesc: false
        // }, {
        //     name: 'maxValue',
        //     orderDesc: false
        // }, {
        //     name: 'criticalLow',
        //     orderDesc: false
        // }, {
        //     name: 'criticalHigh',
        //     orderDesc: false
        // }, {
        //     name: 'notificationLow',
        //     orderDesc: false
        // }, {
        //     name: 'notificationHigh',
        //     orderDesc: false
        // }, {
        //     name: 'isFavourite',
        //     orderDesc: false
        // }, {
        //     name: 'sensorValue',
        //     orderDesc: false
        // }, {
        //     name: 'timeStamp',
        //     orderDesc: false
        // }];

        // $scope.sortData = function (sortCol) {
        //     // make sure it a valid column
        //     var column = cols.find(function (col) {
        //         return col.name === sortCol;
        //     });

        //     if (!column) return;

        //     column.orderDesc = !column.orderDesc;

        //     var order = !column.orderDesc ? 1 : -1;
        //     allSensors.sort(function (a, b) {
        //         if (a[column.name] < b[column.name])
        //             return -1 * order;
        //         if (a[column.name] > b[column.name])
        //             return 1 * order;
        //         return 0;
        //     });

        //     setPagingData($scope.currentPage);
        // };

        // $scope.selectedRow = null;  // initialize our variable to null
        // $scope.setClickedRow = function (index, sel) {  //function that sets the value of selectedRow to current index
        //     $scope.selectedRow = index;
        //     $scope.selectedID = sel.id;
        //     $scope.selectedSensor = sel.sensorName;
        //     $scope.selectedGroup = sel.sensorGroup;
        //     $scope.selectedItem = sel.sensorGroup[0];
        //     //console.log("sel.sensorGroup1" + $scope.selectedItem)
        //     $scope.selectedLow = sel.minValue;
        //     $scope.selectedHigh = sel.maxValue;
        //     $scope.selectedCriticalLow = sel.criticalLow;
        //     $scope.selectedCriticalHigh = sel.criticalHigh;
        //     $scope.selectedNotificationLow = sel.notificationLow;
        //     $scope.selectedNotificationHigh = sel.notificationHigh;
        //     $scope.selectedIsFavourite = sel.isFavourite;
        //     $scope.selectedValue = sel.sensorValue;
        //     $scope.selectedtimeStamp = sel.timeStamp;
        //     //console.log(sel);

        //     $scope.titleFontColor = undefined;
        //     var selectedValue = $scope.selectedValue;
        //     console.log("selectedValue: " + selectedValue);
        //     $scope.value = $scope.selectedValue;
        //     $scope.valueFontColor = undefined;

        //     $scope.min = $scope.selectedLow;
        //     $scope.max = $scope.selectedHigh;

        //     $scope.valueMinFontSize = undefined;
        //     $scope.titleMinFontSize = undefined;
        //     $scope.labelMinFontSize = undefined;
        //     $scope.minLabelMinFontSize = undefined;
        //     $scope.maxLabelMinFontSize = undefined;

        //     $scope.hideValue = false;
        //     $scope.hideMinMax = false;
        //     $scope.hideInnerShadow = false;

        //     $scope.width = undefined;
        //     $scope.height = undefined;
        //     $scope.relativeGaugeSize = undefined;

        //     //$scope.gaugeWidthScale = 0.5;
        //     $scope.gaugeWidthScale = 1;
        //     $scope.gaugeColor = undefined; //'grey';

        //     $scope.showInnerShadow = true;
        //     $scope.shadowOpacity = 0.5;
        //     $scope.shadowSize = 3;
        //     $scope.shadowVerticalOffset = 10;

        //     $scope.levelColors = undefined; //['#00FFF2', '#668C54', '#FFAF2E', '#FF2EF1'];
        //     $scope.customSectors = undefined;
        //     // $scope.customSectors = [
        //     //     { color: "#ff0000", lo: -30, hi: -15 },
        //     //     { color: "#00ff00", lo: -15, hi: 0 },
        //     //     { color: "#FFC300", lo: 0, hi: 15 },
        //     //     { color: "#0000ff", lo: 15, hi: 30 }
        //     // ];
        //     $scope.noGradient = false;

        //     $scope.label = undefined;
        //     $scope.labelFontColor = "#561b55";

        //     $scope.startAnimationTime = 0;
        //     $scope.startAnimationType = undefined;
        //     $scope.refreshAnimationTime = undefined;
        //     $scope.refreshAnimationType = undefined;

        //     $scope.donut = undefined;
        //     $scope.donutAngle = 90;

        //     $scope.counter = true;
        //     $scope.decimals = 2;
        //     $scope.symbol = 'X';
        //     $scope.formatNumber = true;
        //     $scope.humanFriendly = true;
        //     $scope.humanFriendlyDecimal = true;

        //     $scope.textRenderer = function (value) {
        //         return value;
        //     };


        // }

        // $scope.saveSensor = function () {
        //     console.log("saveSensor: ID " + $scope.selectedID + ' ' + $scope.selectedSensor);
        // }
        // $scope.cancelSaveSensor = function () {
        //     console.log("cancelSaveSensor - reload page");
        // }

        // sensorGroupService.get().then(function (data) {
        //     $scope.items = [];
        //     $scope.selectedItem = undefined;
        //     $scope.dropselectedItem = undefined;
        //     $scope.items = data;
        // });

        // customerService.get().then(function (data) {
        //     $scope.customer = data;
        //     // $scope.customer.companyName = data.company;
        //     // $scope.customer.customerID = data.id;
        //     // $scope.customer.address1 = data.address1;
        //     // $scope.customer.address2 = data.address2;
        //     // $scope.customer.city = data.city;
        //     // $scope.customer.phone = data.phone;
        //     // $scope.customer.zipCode = data.zip;
        //     // $scope.customer.countryCode = data.country_code;
        //     // $scope.customer.countryName = data.country_name;

        //     //console.log("Customer: " + $scope.customer.Name);
        // });


        // function isNumeric(n) {
        //     return !isNaN(parseFloat(n)) && isFinite(n);
        // }

        // function getLength(obj) {
        //     if (obj == null) return 0;
        //     if (obj.length == undefined) return 1;
        //     return obj.length;
        // }

    }]);