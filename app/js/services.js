'use strict';

/* Services */

var garageServices = angular.module('garageServices', ["ngResource"]);

////////////////////////////////////////////////////////////////////////
// DOOR SERVICE
////////////////////////////////////////////////////////////////////////
garageServices.factory('doorService', function($resource, doorState) {
    var IMEI = "999888777666555";
    var Door = $resource('/api/v1/door/:action', {}, {
        status: {method: 'POST', params: {action:'status'}},
        switch: {method: 'POST', params: {action:'switch'}}
    });


    function getIMEI(){
        return IMEI;
    }

    return {
        Door: Door,
        getIMEI: getIMEI
    }
});

garageServices.factory('doorState', function() {
    var doorStatus = 'unknown';

    return {
        doorStatus: doorStatus
    }
});
