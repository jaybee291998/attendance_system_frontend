(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('PeriodController', PeriodController);

    PeriodController.$inject = ['$scope', '$routeParams', '$location', 'Authentication'];

    function PeriodController($scope, $routeParams, $location, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isAdminOrRedirect())return;
        $scope.section_id = $routeParams.section_id;
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;
        $scope.subjects = Authentication.getSubjects();
        if(!Authentication.isPeriodSet()) Authentication.initPeriods();
        let all_instructors = Authentication.getAllInstructors();
        $scope.periods = Authentication.getPeriods(); 
        $scope.section = $scope.sections.filter(section => section.id === parseInt($scope.section_id))[0];
        $scope.year_level = $scope.year_levels.filter(year_level => year_level.id === $scope.section.year_level)[0];
        $scope.header_name = `${$scope.year_level.name} - ${$scope.section.name}`;

        console.log($scope.section);

        let my_profile = Authentication.getAuthenticatedAccount()['account_details'];
        let my_fullname = `${my_profile['first_name']} ${my_profile['last_name']}`;

        $scope.section_periods = $scope.periods.filter(period => period.section === $scope.section.id);
        $scope.named_periods = $scope.section_periods.map(period => {
            let new_periods = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
            new_periods['id'] = period.id;
            // there is a bug that when the instructor became a head teaher we can nolonger access the teacher name
            // since the teacher is no longer on the teacher list
            let ins = all_instructors.filter(instructor => instructor.user === period.instructor)[0];
            if(ins){
                new_periods['instructor_name'] = `${ins.first_name} ${ins.last_name}`
            }else{
                // just assume that the instructor is the head teacher
                new_periods['instructor_name'] = my_fullname;
            }
            
            return new_periods;
        });
        console.log($scope.named_periods);
        // console.log($scope.named_periods);
    }
})();