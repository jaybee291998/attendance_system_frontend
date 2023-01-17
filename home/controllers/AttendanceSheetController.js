(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('AttendanceSheetController', AttendanceSheetController);
    
    AttendanceSheetController.$inject = ['$scope', '$location', '$routeParams', 'Authentication', 'DateUtil'];

    function AttendanceSheetController($scope, $location, $routeParams, Authentication, DateUtil){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isInstructorOrRedirect())return;

        $scope.period_id = $routeParams.period_id;
        $scope.subjects = Authentication.getSubjects();
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;

        let period = Authentication.getPeriods().filter(period => period.id === parseInt($scope.period_id))[0];
        let named_period = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
        $scope.period_name = `${named_period.subject} - ${named_period.year_level} ${named_period.section}`;
        $scope.start_date = new Date();
        $scope.end_date = new Date();
        let max_date = new Date();
        max_date.setDate(max_date.getDate() + 1);
        $scope.min_date = DateUtil.dateToString(new Date());
        $scope.max_date = DateUtil.dateToString(max_date);
        $scope.date_change = () => {
            // console.log($scope.start_date.toString().slice(4,15));
            console.log("start_date:" + DateUtil.dateToString($scope.start_date));
            // console.log(max_date);
            // console.log(DateUtil.dateToString(max_date));
            // console.log($scope.start_date);
            $scope.min_date = DateUtil.dateToString($scope.start_date);
            console.log("end_date: " + DateUtil.dateToString($scope.end_date));
        }

    }
})();