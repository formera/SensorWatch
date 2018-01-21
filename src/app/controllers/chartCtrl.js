
angular
  .module('app')
  .controller('chartCtrl',
  ['$scope',
    '$cookies',
    'commonService',
    'sensorService',
    'chartService',
    'devicesService',
    '$filter',
    '$state',
    function ($scope, $cookies, commonService, sensorService, chartService, devicesService, $filter, $state) {
      if ($state.current.data.requireLogin) {
        if ($cookies.get("isAuthenticated")) {
          // continue
        } else {
          $state.go('login');
        }
      }

      var sensorsGroups = [];
      var allSensors = [];
      var d = new Date();
      d.setHours(d.getHours() - 2);
      $scope.title = "Charts and history";
      $scope.options = [5, 8, 12];
      $scope.itemsPerPage = 5;
      $scope.selectedItem = undefined;

      var d1 = new Date();
      var d2 = new Date();
      d1.setDate(d1.getDate() - 1);
      h1 = commonService.formatDateToHours(d1);
      h2 = commonService.formatDateToHours(d2);
      d1 = $filter('date')(new Date(d1), 'yyyy-MM-dd');
      d2 = $filter('date')(new Date(), 'yyyy-MM-dd');

      $scope.loadChartFrom = d1 + 'T' + h1;
      $scope.loadChartTo = d2 + 'T' + h2;

      $scope.aggregateTo = 30;
      $scope.aggregateBarTo = 1440;
      var sensorType = $state.current.data.sensorTypes[0];

      devicesService.getHubData($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {
        $scope.apidata = response;
        $scope.sensorhubs = response.data;
        if ($scope.apidata.status === 200) {
          for (var i = 0; i < commonService.getLength($scope.apidata.data); i++) {
            for (var ii = 0; ii < commonService.getLength($scope.apidata.data[i].topics); ii++) {
              $scope.sensorhubs[i].topics[ii]["deviceId"] = $scope.apidata.data[i].id;
            }
          }
          $scope.loadChart(null, $scope.sensorhubs[0].topics[0]);
        } else {
        }
      });

      function loadAggrChart(index, sel) {
        $scope.selectedItem = sel;
        var deviceId = sel.deviceId
        var sensor = sel;
        devicesService.getAggregatedSensorData($cookies.get("accessToken"), deviceId, sensor.id, $scope.loadChartFrom, $scope.loadChartTo, $scope.aggregateTo).then(function (response) {
          $scope.aggregatedSensordata = response;
          if ($scope.aggregatedSensordata.status === 200) {
            createSelectedAggrChart($scope.aggregatedSensordata.data, sensor);
            // console.log("ERROR CTRL: getAggregatedSensorData" + JSON.stringify($scope.aggregatedSensordata.data));
          } else {
            console.log("ERROR CTRL: getAggregatedSensorData" + JSON.stringify($scope.aggregatedSensordata));
          }
        });
      };

      $scope.chartAggrOptions = {
        title: {
          text: 'Min, max and averages'
        },
        xAxis: {
          // categories: timeStamp,
          categories: [],
          type: 'datetime'
        },
        chart: {
          type: 'arearange',
          zoomType: 'x'
        },
        yAxis: {
          title: {
            text: null
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          valueSuffix: '° C'
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Temperature',
          // data: averages,
          data: [],
          type: 'line',
          zIndex: 1,
          color: '#A01C6F',
          marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: '#A01C6F'
          }
        }, {
          name: 'Range',
          // data: data,
          data: [],
          type: 'arearange',
          lineWidth: 0,
          linkedTo: ':previous',
          color: '#A01C6F',
          fillOpacity: 0.3,
          zIndex: 0
        }]
      };

      $scope.loadChart = function (index, sel) {

        loadAggrChart(index, sel);
        $scope.updateBarChartData(sel);
        $scope.selectedItem = sel;
        var deviceId = sel.deviceId
        var sensor = sel;
        devicesService.getSensorData($cookies.get("accessToken"), deviceId, sensor.id, $scope.loadChartFrom, $scope.loadChartTo).then(function (response) {
          $scope.sensordata = response;
          if ($scope.sensordata.status === 200) {
            createSelectedChart($scope.sensordata.data, sensor);
          } else {
            //
          }
        });
      }

      $scope.chartOptions = {
        title: {
          text: 'Select sensor'
        },
        xAxis: {
          categories: []
        },
        chart: {
          // width: 900,
          type: 'spline',
          height: 500,
          zoomType: 'x'
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, '#A01C6F'],
                [1, "rgba(86, 27, 75, 0.1)"]
              ]
            },
            marker: {
              radius: 1,
              symbol: 'circle'
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [{
          type: 'area',
          data: []
        }]
      };

      function updateChartData(timeStamp, temperature, sensor) {
        $scope.chartOptions.title.text = sensor.name;
        $scope.chartOptions.xAxis.categories = timeStamp;
        $scope.chartOptions.series[0].name = sensor.name;
        $scope.chartOptions.series[0].data = temperature;
        $scope.chartOptions.series[0].color = '#A01C6F';
      };

      function updateAggrChartData(timeStamp, averages, range, sensor) {
        $scope.chartAggrOptions.xAxis.categories = timeStamp;
        $scope.chartAggrOptions.series[0].name = sensor.name;
        $scope.chartAggrOptions.series[0].data = averages;
        $scope.chartAggrOptions.series[1].data = range;
      };

      function createSelectedChart(data, sensor) {
        var timeStamp = data.map(function (a) { return $filter('date')(new Date(a.timeStamp), 'yyyy-MM-dd HH:mm'); });
        var temperature = data.map(function (a) { return parseFloat(a.value); });
        updateChartData(timeStamp, temperature, sensor);
      }

      function createSelectedAggrChart(data, sensor) {
        var timeStamp = data.map(function (a) { return $filter('date')(new Date(a.timeStamp), 'yyyy-MM-dd HH:mm'); });
        var averages = data.map(function (a) { return a.avg; });
        var range = [];
        for (var i in data) {
          var serie = new Array(data[i].timeStamp, data[i].min, data[i].max);
          range.push(serie);
        }
        updateAggrChartData(timeStamp, averages, range, sensor);
      }

      $scope.chartBarOptions = {
        title: {
          text: ''
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

      $scope.updateBarChartData = function (sel) {
        var chartData;
        var bardata = [];
        var timeStampBar = [];
        var deviceId = sel.deviceId;
        var sensor = sel.id;
        var dFm = new Date();
        dFm.setDate(dFm.getDate() - 5);
        dFm = $filter('date')(new Date(dFm), 'yyyy-MM-dd HH:mm');
        dTo = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');

        if (sel.type == "temperature") {
          sensorType = $state.current.data.sensorTypes[0];
        }
        if (sel.type == "humidity") {
          sensorType = $state.current.data.sensorTypes[1];
        }

        devicesService.getAggregatedSensorData($cookies.get("accessToken"), deviceId, sensor, dFm, dTo, $scope.aggregateBarTo).then(function (response) {
          $scope.aggregatedSensordata = response;
          if ($scope.aggregatedSensordata.status === 200) {
            chartData = $scope.aggregatedSensordata.data

            timeStampBar = chartData.map(function (a) { return $filter('date')(new Date(a.timeStamp), 'yyyy-MM-dd HH:mm'); });
            for (var i in chartData) {
              var serie = new Array(chartData[i].min, chartData[i].max);
              bardata.push(serie);
            }
            $scope.chartBarOptions.title.text = sensorType.desc + ' variation last five days';
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



      // sensorService.get().then(function (data) {
      //   allSensors = data;
      //   $scope.totalItems = data.length;
      //   $scope.currentPage = 1;
      //   $scope.allSensors = data;
      //   var uniqueGroups = [];
      //   for (i = 0; i < data.length; i++) {
      //     if (uniqueGroups.indexOf(data[i].sensorGroup) === -1) {
      //       uniqueGroups.push(data[i].sensorGroup);
      //     }
      //   }
      //   $scope.uniqueGroups = uniqueGroups;
      // });

      // $scope.$watch('currentPage', function () {
      //   setPagingData($scope.currentPage);
      // });

      // function setPagingData(page) {
      //   $scope.currentPage = page;
      //   var pagedData = allSensors.slice((page - 1) * $scope.itemsPerPage, page * $scope.itemsPerPage);
      //   $scope.pagedData = pagedData;
      // }

      // function setItemsPerPage(num) {
      //   $scope.itemsPerPage = num;
      //   $scope.currentPage = 1; //reset to first paghe
      // }

      // $scope.selectedRow = null;  // initialize our variable to null
      // $scope.setClickedRow = function (index, sel) {  //function that sets the value of selectedRow to current index
      //   $scope.selectedRow = index;
      //   $scope.selectedID = sel.id;
      //   $scope.selectedSensor = sel.sensorName;
      //   $scope.sensorValue = sel.sensorValue;
      //   console.log("ClickedSensor: ID " + $scope.selectedID + ' ' + $scope.sensorValue);
      //   createBarChart(sel);
      //   createMultiBarHorizontalChart(sel);
      // }

      // function createBarChart(selItem) {
      //   sensorsLast24hService.get(selItem.id).then(function (data) {
      //     $scope.sensorsLast24h = data;
      //     $scope.options24h = chartService.discreteBarChart.options()
      //     $scope.data24h = chartService.discreteBarChart.data(data)
      //   });
      // }

      // function createMultiBarHorizontalChart(selItem) {
      //   sensorsLast10daysService.get(selItem.id).then(function (data) {
      //     $scope.optionsMulti = chartService.multiBarHorizontalChart.options(selItem)
      //     $scope.dataMulti = chartService.multiBarHorizontalChart.data(data)
      //   });
      // }

      // function createFreezerChart(data) {
      //   sensorsByTypeService.get(1).then(function (data) {
      //     $scope.linechart_data1 = data.historyData;
      //     $scope.linechart_xkey1 = "adjustedTime";
      //     $scope.linechart_ykey1 = data.idString;
      //     $scope.linechart_labels1 = data.labelString;
      //     $scope.linechart_colors1 = ["#a01c6f", "#561b55", "#31C0BE", "#c7254e"];

      //     // console.log("createfavouriteHistoryChart: " + data.labelString);
      //   });
      // }
      // createFreezerChart();

      // function createFridgeChart() {
      //   sensorsByTypeService.get(2).then(function (data) {
      //     $scope.linechart_data2 = data.historyData;
      //     $scope.linechart_xkey2 = "adjustedTime";
      //     $scope.linechart_ykey2 = data.idString;
      //     $scope.linechart_labels2 = data.labelString;
      //     //$scope.linechart_colors2 = ["#a01c6f", "#561b55", "#31C0BE", "#c7254e"];

      //     // console.log("createfavouriteHistoryChart: " + data.labelString);
      //   });
      // }
      // createFridgeChart();

      // function createOvenChart() {
      //   sensorsByTypeService.get(3).then(function (data) {
      //     $scope.linechart_data3 = data.historyData;
      //     $scope.linechart_xkey3 = "adjustedTime";
      //     $scope.linechart_ykey3 = data.idString;
      //     $scope.linechart_labels3 = data.labelString;
      //     //$scope.linechart_colors2 = ["#a01c6f", "#561b55", "#31C0BE", "#c7254e"];

      //     // console.log("createfavouriteHistoryChart: " + data.labelString);
      //   });
      // }
      // createOvenChart();

      // function formatDateToHours(date) {
      //   return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
      // };

    }]);


