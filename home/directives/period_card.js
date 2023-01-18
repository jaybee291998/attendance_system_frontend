(function(){
    'use strict';

    angular
        .module('attendancehub.home.directives')
        .directive('myPeriodCard', PeriodCard);

    function PeriodCard(){
        function controller($scope, $location){
            $scope.click = () => {
                console.log($scope.myLink);
                $location.path($scope.myLink + $scope.id);
            }
        }

        let directive = {
            restrict: 'E',
            scope: {
                header: '=',
                subheader: '=',
                myLink: '=', 
                id: '=',
                body: '='
            },
            templateUrl: 'home/pages/my-period-card.html',
            controller: ['$scope', '$location', controller]      
        };

        return directive;
    }
})();