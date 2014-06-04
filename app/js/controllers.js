'use strict';

/* Controllers */

var garageControllers = angular.module('garageControllers', ['garageServices', 'garageDirectives']);

////////////////////////////////////////////////////////////////////////
//     Keypad Controller
////////////////////////////////////////////////////////////////////////
garageControllers.controller('KeypadController', function ($scope,
                            $log, doorService, doorState) {
    $scope.pad = {};
    $scope.pad.keycode = "";


    $scope.getState = function(){
        return doorState.doorStatus;
    }
    $scope.key = function(k){
        var test = $scope.pad.keycode.match('[0-9]');
        if(test == null) // non digits
            $scope.pad.keycode = ""; // clear field before start
        $scope.pad.keycode = $scope.pad.keycode + k;
    }
    $scope.clear = function(){
        $scope.pad.keycode = "";
    }
    $scope.enter = function(){
        console.log($scope.pad.keycode);
        doorOperate($scope.pad.keycode);
    }

    function doorOperate(code){
        var door = new doorService.Door();
        door.keycode = code;
        door.IMEI = doorService.getIMEI();
        door.$switch(function (response){
            $scope.pad.keycode = response.response;
            console.log(response);
        });
    }
});

////////////////////////////////////////////////////////////////////////
//     StatusLabelController
////////////////////////////////////////////////////////////////////////
garageControllers.controller('statusLabelController', function ($scope,
                            $log, doorState) {
    $scope.door = {};

    var url = window.location.href;
    console.log("open socket to: " + url);

    var socket = io.connect(url);
    socket.on('doorStatus', function (data) {
        doorState.doorStatus = data;
        $scope.$apply();
    });

    $scope.doorState = doorState;
    $scope.$watch('doorState.doorStatus', function(newVal, oldVal){
        console.log("watch " + newVal);
        if(newVal == "open"){
            $scope.door.statusLabelColor = 'success';
            $scope.door.status = "open";
        } else if(newVal == "moving"){
            $scope.door.statusLabelColor = 'warning';
            $scope.door.status = "moving";
        } else if(newVal == "unknown"){
            $scope.door.statusLabelColor = 'default';
            $scope.door.status = "unknown";
        } else {
            $scope.door.statusLabelColor = 'danger';
            $scope.door.status = "closed";
        }
    });

    $scope.door.status = doorState.doorStatus;

 });

////////////////////////////////////////////////////////////////////////
//     Forgot Controller
////////////////////////////////////////////////////////////////////////
garageControllers.controller('ForgotController', function ($scope) {
    $scope.keycode = "98765";
});
