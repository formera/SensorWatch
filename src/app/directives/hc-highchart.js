angular.module('app')
    // Directive for generic chart, pass in chart options
    .directive('hcChart', function () {
        return {
            restrict: 'E',
            template: '<div class="chart-container"><div>',
            replace: true,
            scope: {
                options: '='
            },
            link: function (scope, element) {
                var chart = new Highcharts.chart(element[0], scope.options);
                $(window).resize(function () {
                    chart.reflow();
                });                
                Highcharts.chart(element[0], scope.options);
                scope.$watch('options', function (newVal) {
                    if (newVal) {
                        Highcharts.chart(element[0], scope.options);
                    }
                }, true);
            }
        };
    })

    // Directive for pie charts, pass in title and data only    
    .directive('hcPieChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: scope.title
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    data: scope.data
                }]
            });
        }
    };
})