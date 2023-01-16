(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('PeriodCreationController', PeriodCreationController);

    PeriodCreationController.$inject = ['$scope', '$timeout', 'Authentication'];

    function PeriodCreationController($scope, $timeout, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isInstructorOrRedirect())return;
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section['year_levels'];
        let sections = year_section['sections'];
        $scope.subjects = Authentication.getSubjects();
        $scope.valid_sections = [];
        $scope.disable_section_selection = true;

        $scope.period = {};
        $scope.year_select = () => {
            $scope.valid_sections = sections.filter(section => section['year_level'] === parseInt($scope.period.year_level));
            $scope.disable_section_selection = false;

        }
        $scope.submit = () => {
            console.log($scope.period);
            let data = {
                subject: $scope.period.subject,
                section: $scope.period.section
            };

            console.log(data);
            const succ = response => {
                Authentication.initPeriods();
                console.log(response.data);

                let period_named = period_to_named_period(response.data, $scope.year_levels, $scope.valid_sections, $scope.subjects);
                // $scope.post_success = `Successfully created`;
                let data = `Successfully created ${period_named.year_level} ${period_named.section} - ${period_named.subject}`;
                set_post_success(data);
                // set_post_success();
                Authentication.initPeriods();
            }

            const err = response =>{
                // $scope.post_errors = response.data;
                // set_post_errors(reponse.data);
                set_post_errors(response.data);
                // $scope.post_errors = response.data;
                // console.log(response);

                let subject_name = $scope.subjects.filter(subject => subject.id === parseInt($scope.period.subject))[0].name;
                let selected_section = $scope.valid_sections.filter(section => section.id === parseInt($scope.period.section))[0];
                let section_name = selected_section.name;
                let year_level_section =  selected_section.year_level;
                let year_level_name = $scope.year_levels.filter(year_level => year_level.id === parseInt(year_level_section))[0].name;
                console.log(section_name);
                console.log(subject_name);
                console.log(year_level_name);

                console.log(period_to_named_period($scope.period, $scope.year_levels, $scope.valid_sections, $scope.subjects));
            }
            Authentication.createPeriod(data, succ, err);
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

        function set_then_unset(data, variable){
            variable = data;
            $timeout(()=>{
                variable = null;
            }, 3000);
            // $scope.$apply();
        }
        function set_post_success(post_success){
            $scope.post_success = post_success;
            $timeout(()=>{
                $scope.post_success = null;
            }, 5000);
            // $scope.apply();
        }

        function set_post_errors(post_errors){
            $scope.post_errors = post_errors;
            $timeout(()=>{
                $scope.post_errors = null;
            }, 5000);
            // $scope.$apply();
        }
    }
})();