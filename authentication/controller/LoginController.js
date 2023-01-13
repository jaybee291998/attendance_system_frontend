(function(){
    angular
        .module('attendancehub.authentication.controllers')
        .controller('LoginController', ['$location', '$scope', 'Authentication', LoginController]);


        function LoginController($location, $scope, Authentication){
            // redirect if authenticated
            if(Authentication.isAuthenticated()) $location.path('/');
            let vm = this;
            vm.login = function(){
                let p = Authentication.login(vm.email, vm.password);
                p.then(function(value){
                    if(value.status < 200 || value.status > 299){
                        $scope.error = value.data.error_message;
                        console.warn(value);
                    }
                }, function(reason){
                    console.log("Error: " + JSON.stringify(reason));
                });
            }
        }
})();