angular
  .module('app')
  .factory('commonService', ['$http', 'appConstants', function ($http, appConstants) {
    return {
      getLength: function (obj) {
        if (obj == null) return 0;
        if (obj.length == undefined) return 1;
        return obj.length;
      },

      isNumeric: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      },

      formatDateToHours: function (date) {
        return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
      }
      
    };
  }])    