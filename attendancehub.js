(function(){
    'use strict';

    angular.module('attendancehub', [
        'ngCookies',
        'attendancehub.config',
        'attendancehub.routes',
        'attendancehub.authentication',
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
        }else{
            console.log("Not Authenticated");
        }
    }
})();