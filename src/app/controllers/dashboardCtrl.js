angular
    .module('app')
    .controller('dashboardCtrl',
    ['$scope', 'sensorService', 'commonService', 'alertService', 'devicesService', '$cookies', '$state', '$filter',
        function($scope, sensorService, commonService, alertService, devicesService, $cookies, $state, $filter) {

            if ($state.current.data.requireLogin) {
                if ($cookies.get("isAuthenticated")) {
                    // continue
                } else {
                    $state.go('login');
                }
            }
            $scope.title = "Dashboard";
            $scope.totalSensors = 0;
            $scope.totalHubs = 0;
            $scope.allSensorGroups = 0;
            $scope.chartBarOptions = [];

            if (commonService.isNumeric($cookies.get("aggrDashboardChart")) === true) {
                $scope.aggrDashboardChart = $cookies.get("aggrDashboardChart");
            } else {
                $scope.aggrDashboardChart = 180;
            };

            var sensorType = $state.current.data.sensorTypes[0];

            devicesService.getHubData($cookies.get("accessToken"), $cookies.get("systemId")).then(function(response) {
                $scope.totalSensors = 0;
                if (response.status === 200) {
                    $scope.totalHubs = commonService.getLength(response.data);
                    for (var i = 0; i < commonService.getLength(response.data); i++) {
                        var id = response.data[i].id;
                        var now = new Date();
                        $scope.totalSensors = $scope.totalSensors + response.data[i].topics.length;
                    }
                    getFavourites(response.data);
                    getGroups();
                } else {
                    console.log("CTRLR getHubData ERROR: " + JSON.stringify(response));
                }
            });

            function getFavourites(hubdata) {
                var sensorsFav = [];
                devicesService.getFavourites($cookies.get("accessToken"), $cookies.get("userId")).then(function(response) {
                    $scope.favdata = response;
                    if ($scope.favdata.status === 200) {
                        $scope.favourites = response.data;
                        $scope.favouriteSensorsCount = commonService.getLength($scope.favourites);
                        for (var i = 0; i < commonService.getLength($scope.favourites); i++) {
                            for (var ii = 0; ii < commonService.getLength(hubdata); ii++) {
                                if ($scope.favourites[i].deviceId === hubdata[ii].id) {
                                    for (var iii = 0; iii < commonService.getLength(hubdata[ii].topics); iii++) {
                                        if ($scope.favourites[i].topic == hubdata[ii].topics[iii].id) {
                                            hubdata[ii].topics[iii]["hubId"] = hubdata[ii].id;
                                            sensorsFav.push(hubdata[ii].topics[iii]);
                                        }
                                    }
                                }
                            }
                        }
                        $scope.favouriteSensors = sensorsFav;
                        $scope.updateChartData(sensorsFav[0]);
                    } else {
                        console.log("CTRLR getFavourites ERROR: " + JSON.stringify($scope.favouriteSensors));
                    }
                });
            };

            function getGroups() {
                devicesService.getClient($cookies.get("accessToken"), $cookies.get("systemId")).then(function(response) {
                    $scope.client = response;
                    if ($scope.client.status === 200) {
                        if (typeof $scope.client.data.length === "undefined") {
                            $scope.allSensorGroups = $scope.client.data.groupings.length;
                        } else {
                            for (var i = 0; i < commonService.getLength($scope.client.data); i++) {
                                $scope.allSensorGroups = $scope.allSensorGroups + $scope.client.data[i].groupings.length;
                            }
                        };
                    } else {
                        console.log("CTRLR getGroups ERROR: " + JSON.stringify($scope.client));
                    }
                });
            };

            // alertService.get().then(function(data) {
                $scope.allAlerts = 0;
            // });

            $scope.chartBarOptions = {
                title: {
                    text: sensorType.desc + ' variation 24 hours'
                },
                chart: {
                    type: 'columnrange',
                    inverted: true
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    valueSuffix: ''
                },
                plotOptions: {
                    columnrange: {
                        dataLabels: {
                            enabled: true,
                            // formatter: function () {
                            //   return this.y + '°C';
                            // }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: '',
                    data: [],
                    color: '#A01C6F'
                }]
            };

            $scope.updateChartData = function(sel) {
                var chartData;
                var bardata = [];
                var timeStampBar = [];
                var deviceId = sel.hubId;
                var sensor = sel.id;

                var d1 = new Date();
                d1.setDate(d1.getDate() - 1);
                var d2 = new Date();
                h1 = commonService.formatDateToHours(d1);
                h2 = commonService.formatDateToHours(d2);
                d1 = $filter('date')(new Date(d1), 'yyyy-MM-dd');
                d2 = $filter('date')(new Date(), 'yyyy-MM-dd');
                var i1 = d1 + 'T' + h1;
                var i2 = d2 + 'T' + h2;

                if (sel.type == "temperature") {
                    sensorType = $state.current.data.sensorTypes[0];
                }
                if (sel.type == "humidity") {
                    sensorType = $state.current.data.sensorTypes[1];
                }

                devicesService.getAggregatedSensorData($cookies.get("accessToken"), deviceId, sensor, i1, i2, $scope.aggrDashboardChart).then(function(response) {
                    $scope.aggregatedSensordata = response;
                    if ($scope.aggregatedSensordata.status === 200) {
                        $scope.response = response;
                        chartData = $scope.aggregatedSensordata.data

                        timeStampBar = chartData.map(function(a) { return $filter('date')(new Date(a.timeStamp), 'yyyy-MM-dd HH:mm'); });
                        for (var i in chartData) {
                            var serie = new Array(chartData[i].min, chartData[i].max);
                            bardata.push(serie);
                        }
                        $scope.chartBarOptions.subtitle.text = sel.name;
                        $scope.chartBarOptions.xAxis.categories = timeStampBar;
                        $scope.chartBarOptions.yAxis.title.text = sensorType.desc + ' ' + sensorType.suffix;
                        $scope.chartBarOptions.tooltip.valueSuffix = ' ' + sensorType.suffix;
                        $scope.chartBarOptions.series[0].data = bardata;
                        $scope.chartBarOptions.series[0].name = sel.name;

                    } else {
                        console.log("ERROR CTRL: getAggregatedSensorData" + JSON.stringify($scope.aggregatedSensordata));
                    }
                });

            };

        }]);


