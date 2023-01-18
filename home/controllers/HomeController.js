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
            if(Authentication.isInstructor() || Authentication.isAdmin()){
                Authentication.setVerifiedOnce();
                Authentication.initPeriodsOnce();
                let year_section = Authentication.getYearSection();
                $scope.year_levels = year_section.year_levels;
                $scope.sections = year_section.sections;
                $scope.subjects = Authentication.getSubjects();
                if(!Authentication.isPeriodSet()) Authentication.initPeriods();
                $scope.my_periods = Authentication.getPeriods();
    
                $scope.named_periods = $scope.my_periods.map(period => {
                    let new_periods = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
                    new_periods['id'] = period.id;
                    return new_periods;
                });
                console.log($scope.named_periods);
            }; 
            vm.logout = logout;
            $scope.isInstructor = Authentication.isInstructor();
            $scope.isAdmin = Authentication.isAdmin();


            function logout(){
                Authentication.unAuthenticate();
                $location.path('/login');
            }

            $scope.year_level_select = (id) => {
                console.log(id);
            }


            if(Authentication.isSubjectSet()) console.log(Authentication.getSubjects());

            console.log(Authentication.getYearSection());
        }
})();