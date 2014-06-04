var garageApp = angular.module('Garage', [
    'ngRoute',
    'garageControllers',
    'garageDirectives',
    'garageServices'
    ]);


garageApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/keypad.html',
                controller: 'KeypadController'
            }).
            when('/register', {
                templateUrl: 'partials/register.html',
                controller: 'forgotController'
            }).
            when('/forgot', {
                templateUrl: 'partials/forgot.html',
                controller: 'forgotController'
            }).
            otherwise({
                redirectTo: '/'
            });

    }]);

