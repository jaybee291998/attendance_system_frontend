(function(){
    'use strict';
    angular
        .module('attendancehub.home.controllers')
        .controller('UserProfileController', UserProfileController);

        UserProfileController.$inject = ['$scope', '$location', '$timeout', 'Authentication'];

        function UserProfileController($scope, $location, $timeout, Authentication){
            if(Authentication.authenticatedOrRedirect())return;

            // $scope.user = Authentication.getAuthenticatedAccount()["profile"];
            $scope.page_error = null;
            $scope.user = Authentication.getUserProfile();
            let data = Authentication.getYearSection();
            $scope.year_levels = data.year_levels;
            $scope.sections = data.sections;
            $scope.valid_sections = [];
            $scope.disable_section_selection = false;
            $scope.sex_choices = [
                {id:'M', name:'Male'},
                {id:'F', name:'Female'},
                {id:'O', name:'Other'}
            ];
            $scope.show_request_instructorship = false;
            $scope.show_pending_message = false;

            $scope.isInstructor = Authentication.isInstructor();
            $scope.isAdmin = Authentication.isAdmin();
            
            function init(){
                console.log($scope.user);
                $scope.valid_sections = $scope.sections.filter(section => section.year_level === parseInt($scope.user.year_level))

                console.log(typeof $scope.user.year_level);
                $scope.user.year_level = ""+$scope.user.year_level;
                $scope.user.section = ""+$scope.user.section;
                console.log($scope.year_levels);
                console.log($scope.user.sex);
            }

            if(!$scope.isInstructor && !$scope.isAdmin){
                const succ = response => {
                    console.log(response.data);
                    let last_request = response.data.at(-1);
                    // if(last_request.length === 0)
                    if(last_request != null && last_request.status === 'P') $scope.show_pending_message = true;
                    else $scope.show_request_instructorship = true;
                }
                const err = response => {
                    setPageError(response)
                }
                Authentication.fetchInstructorshipRequest(succ, err);
            }

            $scope.requestInstructorship = () => {
                const succ = response => {
                    console.log(response);
                    $scope.show_pending_message = true;
                    $scope.show_request_instructorship = false;
                }

                const err = response => {
                    setPageError(response.data)
                }

                Authentication.requestInstructorship(succ, err);
            }

            function setPageError(error){
                $scope.page_error = error;
                $timeout(()=>{
                    $scope.page_error = null;
                }, 10*1000);
            }



            init();
            $scope.year_select = () => {

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
                        console.log(response.data);
                        Authentication.setUserProfile(response.data)
                        $location.path('/');
                    }
                })
            }

            $scope.options = [
                {id:1, name:"Mahogany", selected:false},
                {id:2, name:"Melina", selected:false},
                {id:3, name:"Molave", selected:true}
            ];

            $scope.test = "2"
        }
})();