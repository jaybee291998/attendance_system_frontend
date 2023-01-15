(function(){
    'use strict';

    angular.module('attendancehub', [
        'ngCookies',
        'ngMessages',
        'attendancehub.config',
        'attendancehub.routes',
        'attendancehub.authentication',
        'attendancehub.home',
        'attendancehub.util'
    ]);

    angular
        .module('attendancehub.config', []);

    angular
        .module('attendancehub.routes', ['ngRoute']);
    
    angular
        .module('attendancehub')
        .run(run);

    run.$inject = ['$http', 'Authentication'];

    /**
     * @name run
     * @desc update authorization header to send authentication token
     */
    function run($http, Authentication){
        if(Authentication.isAuthenticated()){
            Authentication.setAuthorizationHeader();
            console.log("Authenticated");
            console.log(Authentication.getAuthenticatedAccount());
            if(Authentication.isInstructor()){
                Authentication.setVerified()
            }
        }else{
            console.log("Not Authenticated");
        }
        Authentication.fetchYearSection()
        .then(response => {
            if(response.status >= 200 || response.status <= 299){
                // $scope.year_levels = response.data.year_levels;
                // $scope.sections = response.data.sections;
                Authentication.setYearSection(response.data.year_levels, response.data.sections)
                console.log("Year Section Set");
            }else{
                $scope.page_error = `There has been an error. Please refresh the page`
            }
        });
    }
})();