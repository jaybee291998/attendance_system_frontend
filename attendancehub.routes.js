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
            .when('/home/qr-code/:mode', {
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
            .when('/home/attendance-sheet/:period_id',{
                controller: 'AttendanceSheetController',
                templateUrl: 'home/pages/attendance-sheet.html'
            })
            .when('/home/sections/:year_level_id', {
                controller: 'SectionController',
                templateUrl: 'home/pages/sections.html'
            })
            .when('/home/periods/:section_id',{
                controller: 'PeriodController',
                templateUrl: 'home/pages/period.html'
            })
            .when('/home/summary/:section_id',{
                controller: 'SummaryController',
                templateUrl: 'home/pages/summary.html'
            })
            .when('/home/admin/',{
                controller: 'AdminPanelController',
                templateUrl: 'home/pages/admin-panel.html'
            })
            .when('/ict',{
                templateUrl: 'authentication/pages/spict.html'
            })
            .otherwise('/');
    }
})();