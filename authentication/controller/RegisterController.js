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

            $scope.regex = "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$";
            vm.register = register;
            $scope.page_error = null;
            $scope.year_levels = [];
            $scope.sections = [];
            $scope.valid_sections = [];
            $scope.user_profile = {};
            $scope.dis = false;
            // $scope.
            $scope.sex_choices = [
                {id:'M', name:'Male'},
                {id:'F', name:'Female'},
                {id:'O', name:'Other'}
            ];

            $scope.role_choices = [
                {id:'S', name:'Student'},
                {id:'I', name:'Instructor'},
                {id:'A', name:'Head Teacher'}
            ];
            $scope.disable_section_selection = true;

            Authentication.fetchYearSection()
                .then(response => {
                    if(response.status >= 200 || response.status <= 299){
                        $scope.year_levels = response.data.year_levels;
                        $scope.sections = response.data.sections;
                        $scope.year_levels.push({id:null, name:"none"});
                        $scope.sections.push({id:null, name:"none"});
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

            $scope.role_change = () => {
                console.log($scope.user.role);
                // $scope.user.sex = 'F';
                if($scope.user.role == 'I' || $scope.user.role == 'A'){
                    $scope.valid_sections = $scope.sections;
                    $scope.user.year_level = null;
                    $scope.user.section = null;
                    $scope.dis = true;
                }else{
                    $scope.valid_sections = [];
                    // $scope.user.year_level = null;
                    // $scope.user.section = null;
                    $scope.dis = false;   
                }

            }

            $scope.section_change = () => {
                
            }

            function register(){
                console.log($scope.user);
                if(validateForm()){
                    let user = {email: vm.email, password: vm.password};
                    
                    let p = Authentication.registerUserWithProfile(user, $scope.user, $scope.user.role);
                    p.then(function(response){
                        if(response.status < 200 || response.status > 299){
                            // error
                            $scope.error = response.data;
                        }else{
                            // console.log("success");
                            // $scope.message = `account with email ${response.data.email}`;
                            Authentication.login(vm.email, vm.password)
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