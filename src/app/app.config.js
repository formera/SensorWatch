var app = angular
    .module('app')
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                data: {
                    requireLogin: false
                }
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardCtrl',
                data: {
                    requireLogin: true,
                    sensorTypes: [
                        {
                            "id": 1,
                            "type": "temperature",
                            "desc": "Temperature",
                            "suffix": "°C"
                        },
                        {
                            "id": 2,
                            "type": "humidity",
                            "desc": "Humidity",
                            "suffix": "RH (%)"
                        },
                    ]
                }
            })
            .state('sensors', {
                url: '/sensors',
                templateUrl: 'views/sensors.html',
                controller: 'sensorCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('alerts', {
                url: '/alerts',
                templateUrl: 'views/alerts.html',
                controller: 'alertCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'views/admin.html',
                controller: 'adminCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('charts', {
                url: '/charts',
                templateUrl: 'views/charts.html',
                controller: 'chartCtrl',
                data: {
                    requireLogin: true,
                    sensorTypes: [
                        {
                            "id": 1,
                            "type": "temperature",
                            "desc": "Temperature",
                            "suffix": "°C"
                        },
                        {
                            "id": 2,
                            "type": "humidity",
                            "desc": "Humidity",
                            "suffix": "RH (%)"
                        },
                    ]
                }
            })
            .state('user', {
                url: '/user',
                templateUrl: 'views/user.html',
                controller: 'userCtrl',
                data: {
                    requireLogin: true
                }
            })
            .state('test', {
                url: '/test',
                templateUrl: 'views/test.html',
                controller: 'testCtrl',
                data: {
                    requireLogin: false
                }
            })

    }]);