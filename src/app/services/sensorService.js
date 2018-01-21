angular
  .module('app')
  .factory('sensorService', ['$http', 'appConstants', '$cookies', 'commonService', 'devicesService',
    function ($http, appConstants, $cookies, commonService, devicesService) {
      return {
      createSensorsGroups: function (hubdata, clients) {
        var mySensors = [];
        var groupName = null;
        for (var i = 0; i < commonService.getLength(hubdata); i++) { //for each hub
          for (var ii = 0; ii < commonService.getLength(hubdata[i].topics); ii++) {  // for each sensor in hubs
            groupName = getGroupName(clients, hubdata[i].id + "/" + hubdata[i].topics[ii].id);

            mySensors.push({
              id: hubdata[i].id + "/" + hubdata[i].topics[ii].id,
              deviceId: hubdata[i].id,
              topic: hubdata[i].topics[ii].id,
              name: hubdata[i].topics[ii].name,
              type: hubdata[i].topics[ii].type,
              value: hubdata[i].topics[ii].value,
              min: hubdata[i].topics[ii].min,
              max: hubdata[i].topics[ii].max,
              valueTimeStamp: hubdata[i].topics[ii].valueTimeStamp,
              group: groupName
            });
          }
        }
        return mySensors;
      },

        getSensorsGroups: function (clients) {
           return devicesService.getHubData($cookies.get("accessToken"), $cookies.get("systemId")).then(function (response) {
            if (response.status === 200) {
              sensorsGroups = createSensorsGroups(response.data, clients);
            }
            return sensorsGroups;  //NOT RETURNING OBJECT
          });
        },


      };

      function getGroupName(clients, sensorId) {
        var grpId = "";

        for (var i = 0; i < commonService.getLength(clients); i++) { //for each client
          for (var ii = 0; ii < commonService.getLength(clients[i].groupings); ii++) { //for each groupings
            for (var iii = 0; iii < commonService.getLength(clients[i].groupings[ii].topics); iii++) { //for each topics
              grpId = clients[i].groupings[ii].topics[iii].deviceId + "/" + clients[i].groupings[ii].topics[iii].topic;
              if (grpId == sensorId) {
                return clients[i].groupings[ii].name;
              }
            }
          }
        }
        return '';
      }

    }])    