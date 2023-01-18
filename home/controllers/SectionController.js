(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('SectionController', SectionController);

    SectionController.$inject = ['$scope', '$location', '$routeParams', 'Authentication'];

    function SectionController($scope, $location, $routeParams, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isAdminOrRedirect())return;
        $scope.year_level_id = $routeParams.year_level_id;
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;
        if(!Authentication.isPeriodSet()) Authentication.initPeriods();
        $scope.year_level = $scope.year_levels.filter(year_level => year_level.id === parseInt($scope.year_level_id))[0];
        $scope.year_level_name = $scope.year_level.name;
        $scope.year_level_sections = $scope.sections.filter(section => section.year_level === parseInt($scope.year_level_id));
        console.log($scope.year_level_sections);


    }
})();