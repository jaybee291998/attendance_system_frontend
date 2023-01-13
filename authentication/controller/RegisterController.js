(function(){
    'use strict';
    angular
        .module('attendancehub.authentication.controllers')
        .controller('RegisterController', RegisterController);

        RegisterController.$inject = ['$location', '$scope', 'Authentication'];

        function RegisterController($location, $scope, Authentication){
            if(Authentication.isAuthenticated()){
                $location.path('/');
                return;
            };
            console.log("INSIDE REGISTER")

            let vm = this;

            vm.register = register;
            $scope.page_error = "";
            $scope.year_levels = [];
            $scope.sections = [];
            $scope.valid_sections = [];
            $scope.user_profile = {};
            $scope.disable_section_selection = true;

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
            
            $scope.year_select = () => {
                // $scope.user.year_level = parseInt($scope.user.year_level)
                console.log(typeof $scope.user.year_level);
                $scope.valid_sections = $scope.sections.filter(section => section.year_level === parseInt($scope.user.year_level))
                console.log($scope.valid_sections);
                $scope.disable_section_selection = false;
            }

            $scope.section_change = () => {
                
            }

            function register(){
                console.log($scope.user);
                if(validateForm()){
                    let p = Authentication.register(vm.email, vm.password);
                    p.then(function(response){
                        if(response.status < 200 || response.status > 299){
                            // error
                            $scope.error = response.data;
                        }else{
                            console.log("success");
                            $scope.message = `account with email ${response.data.email}`;
                            Authentication.login(vm.email, vm.password)
                            .then(Authentication.updateUserProfile($scope.user));
                        }
                    })
                } 
            }

            function validateForm(){
                let isFormValid = true;
                if(vm.password != vm.confirmPassword){
                    isFormValid = false;
                    $scope.error = "password must match";
                }

                return isFormValid;
            }

        }
})();