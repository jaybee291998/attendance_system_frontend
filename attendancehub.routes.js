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
            .otherwise('/');
    }
})();