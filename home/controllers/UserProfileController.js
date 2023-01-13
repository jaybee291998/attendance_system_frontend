(function(){
    'use strict';
    angular
        .module('attendancehub.home.controllers')
        .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$scope', '$location', 'Authentication'];

        function UserProfileController($scope, $location, Authentication){
            if(Authentication.authenticatedOrRedirect())return;

            // $scope.user = Authentication.getAuthenticatedAccount()["profile"];
            $scope.user = Authentication.getUserProfile();
            $scope.year_levels = [];
            $scope.sections = [];
            $scope.valid_sections = [];
            $scope.disable_section_selection = false;
            Authentication.fetchYearSection()
                .then(response => {
                    if(response.status >= 200 || response.status <= 299){
                        $scope.year_levels = response.data.year_levels;
                        $scope.sections = response.data.sections;
                        console.log($scope.year_levels);
                        console.log($scope.sections);
                    }else{
                        $scope.page_error = `There has been an error. Please refresh the page`
                    }
                });
            // console.log($scope.user)
            $scope.year_select = () => {
                // $scope.user.year_level = parseInt($scope.user.year_level)
                console.log(typeof $scope.user.year_level);
                $scope.valid_sections = $scope.sections.filter(section => section.year_level === parseInt($scope.user.year_level))
                console.log($scope.valid_sections);
                $scope.disable_section_selection = false;
            }

            $scope.update_profile = () => {
                console.log($scope.user);
                Authentication.updateUserProfile($scope.user)
                .then(response => {
                    if(response.status < 200 || response.status > 299){
                        // error
                        $scope.error = response.data;
                    }else{
                        console.log("success");
                        $scope.message = `u[dayed] ${response.data.email}`;
                        // Authentication.login(vm.email, vm.password)
                        console.log(response.data);
                        Authentication.setUserProfile(response.data)
                        $location.path('/');
                    }
                })
            }
        }
})();