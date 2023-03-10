(function(){
    'use strict';
    angular
        .module('attendancehub.home.controllers')
        .controller('HomeController', HomeController);

        HomeController.$inject = ['$scope', '$location', '$interval', 'Authentication'];

        function HomeController($scope, $location, $interval, Authentication){
            if(Authentication.authenticatedOrRedirect())return;
            console.log('INSIDE HOME CONTROLLER');
            $scope.random_quote = {
                "quote": null,
                "author": null
            };
            let vm = this;
            $scope.account = Authentication.getAuthenticatedAccount()['account_details']['email'];
            if(Authentication.isInstructor() || Authentication.isAdmin()){
                if(!Authentication.isAllInstructorsSet()) Authentication.initAllInstructors();
                // if(!Authentication.isVerifiedUsersLoaded()) Authentication.setVerified();
                Authentication.setVerifiedOnce();
                // Authentication.initPeriodsOnce();
                let year_section = Authentication.getYearSection();
                $scope.year_levels = year_section.year_levels;
                $scope.sections = year_section.sections;
                $scope.subjects = Authentication.getSubjects();
                if(!Authentication.isPeriodSet()){
                    let p = Authentication.fetchPeriods(succ, err);
                    function succ(response){
                        let data = response.data;
                        Authentication.setPeriods(data);
                        console.log(data);
                        $scope.my_periods = Authentication.getPeriods();
    
                        $scope.named_periods = $scope.my_periods.map(period => {
                            let new_periods = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
                            new_periods['id'] = period.id;
                            return new_periods;
                        });
                        console.log($scope.named_periods);
                        // $scope.$apply();
                    }
    
                    function err(response){
                        console.error(response);
                    }
                }else{
                    $scope.my_periods = Authentication.getPeriods();
    
                    $scope.named_periods = $scope.my_periods.map(period => {
                        let new_periods = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
                        new_periods['id'] = period.id;
                        return new_periods;
                    });
                    console.log($scope.named_periods);
                }

            }; 
            vm.logout = logout;
            $scope.isInstructor = Authentication.isInstructor();
            $scope.isAdmin = Authentication.isAdmin();


            function logout(){
                Authentication.unAuthenticate();
                Authentication.unsetUserSession();
                $location.path('/ict');
            }

            $scope.year_level_select = (id) => {
                console.log(id);
            }

            $scope.get_random_quote = () => {
                Authentication.getRandomQuote(res => {
                    $scope.random_quote["quote"] = res.data.content;
                    $scope.random_quote["author"] = res.data.author;
                    console.log(res);
                }, res => {
                    console.error(res);
                });
            }

            let get_quote_interval = undefined;
            if(!$scope.isAdmin && !$scope.isInstructor){
                get_quote_interval = $interval($scope.get_random_quote, 30*1000);
            }

            let stop_quote_interval = () =>{
                if(angular.isDefined(get_quote_interval)){
                    $interval.cancel(get_quote_interval);
                    get_quote_interval = undefined;
                }
            }

            $scope.$on('$destroy', ()=>{
                stop_quote_interval();
            });



            if(Authentication.isSubjectSet()) console.log(Authentication.getSubjects());

            console.log(Authentication.getYearSection());
            $scope.get_random_quote();
        }
})();