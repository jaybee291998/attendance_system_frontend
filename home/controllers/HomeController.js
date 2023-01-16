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
            if(Authentication.isInstructor()){
                Authentication.setVerifiedOnce();
                Authentication.initPeriodsOnce();
            }; 
            vm.logout = logout;
            $scope.isInstructor = Authentication.isInstructor();
            let year_section = Authentication.getYearSection();
            $scope.year_levels = year_section.year_levels;
            $scope.sections = year_section.sections;
            $scope.subjects = Authentication.getSubjects();
            $scope.my_periods = Authentication.getPeriods();

            $scope.named_periods = $scope.my_periods.map(period => {
                let new_periods = period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
                new_periods['id'] = period.id;
                return new_periods;
            });
            console.log($scope.named_periods);

            function logout(){
                Authentication.unAuthenticate();
                $location.path('/login');
            }
            function period_to_named_period(period, year_levels, sections, subjects){
                let subject_id = period.subject;
                let subject_name = subjects.filter(subject => subject.id === parseInt(subject_id))[0].name;
                let section_id = period.section;
                let selected_section = sections.filter(section => section.id === parseInt(section_id))[0];
                let section_name = selected_section.name;
                let year_level_section =  selected_section.year_level;
                let year_level_name = year_levels.filter(year_level => year_level.id === parseInt(year_level_section))[0].name;
                let d = {
                    subject: subject_name,
                    year_level: year_level_name,
                    section: section_name
                }
                return d;
            }

            if(Authentication.isSubjectSet()) console.log(Authentication.getSubjects());

            console.log(Authentication.getYearSection());
        }
})();