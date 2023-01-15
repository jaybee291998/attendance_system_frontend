(function(){
    'use strict';
    angular
        .module('attendancehub.home.controllers')
        .controller('HomeController', HomeController);

        HomeController.$inject = ['$scope', '$location', 'Authentication'];

        function HomeController($scope, $location, Authentication){
            if(Authentication.authenticatedOrRedirect())return;
            console.log('INSIDE HOME CONTROLLER');
            let vm = this;
            $scope.account = Authentication.getAuthenticatedAccount()['account_details']['email'];
            if(Authentication.isInstructor()) Authentication.setVerifiedOnce(); 
            vm.logout = logout;
            $scope.isInstructor = Authentication.isInstructor();
            function logout(){
                Authentication.unAuthenticate();
                $location.path('/login');
            }

            if(Authentication.isSubjectSet()) console.log(Authentication.getSubjects());

            console.log(Authentication.getYearSection());
        }
})();