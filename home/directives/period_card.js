(function(){
    'use strict';

    angular
        .module('attendancehub.home.directives')
        .directive('myPeriodCard', PeriodCard);

    function PeriodCard(){
        function controller($scope, $location){
            $scope.click = () => {
                console.log($scope.periodInfo);
            }
        }

        let directive = {
            restrict: 'E',
            scope: {
                periodInfo: '='
            },
            templateUrl: 'home/pages/my-period-card.html',
            controller: ['$scope', '$location', controller]      
        };

        return directive;
    }
})();