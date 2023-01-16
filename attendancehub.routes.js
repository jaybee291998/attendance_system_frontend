(function() {
    'use strict';

    angular
        .module('attendancehub.routes')
        .config(config);

    config.$inject = ['$routeProvider'];
    
    function config($routeProvider){
        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'authentication/pages/login.html'
            })
            .when('/register', {
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'authentication/pages/register.html'
            })
            .when('/', {
                controller: 'HomeController',
                controllerAs: 'vm',
                templateUrl: 'home/pages/home.html'
            })
            .when('/home/user-profile/',{
                controller: 'UserProfileController',
                templateUrl: 'home/pages/user-profile.html'
            })
            .when('/home/qr-code/', {
                controller: 'QRController',
                templateUrl: 'home/pages/qr-code.html'
            })
            .when('/home/qr-scanner/:period_id', {
                controller: 'QRScannerController',
                templateUrl: 'home/pages/qr-scanner.html'
            })
            .when('/home/create-period/', {
                controller: 'PeriodCreationController',
                templateUrl: 'home/pages/period-creation.html'
            })
            .otherwise('/');
    }
})();