(function(){
    'use strict';

    angular
        .module('attendancehub.authentication.services')
        .factory('Authentication', Authentication);

        Authentication.$inject = ['$cookies', '$http', '$location'];

        function Authentication($cookies, $http, $location){
            let Authentication = {
                login: login,
                register: register,
                fetchYearSection: fetchYearSection,
                updateUserProfile: updateUserProfile,
                isAuthenticated: isAuthenticated,
                setAuthenticatedAccount: setAuthenticatedAccount,
                getAuthenticatedAccount: getAuthenticatedAccount,
                unAuthenticate: unAuthenticate,
                authenticatedOrRedirect: authenticatedOrRedirect,
                setAuthorizationHeader: setAuthorizationHeader,
            }

            return Authentication;

            function login(email, password){
                return $http.post(`${myapi_link}/account/login/`, {
                    email: email, password: password
                }).then(loginSuccessFn, loginErrorFn);

                function loginSuccessFn(response){
                    Authentication.setAuthenticatedAccount(response.data);
                    $location.path('/');
                    return response;
                }

                function loginErrorFn(reason){
                    return reason;
                }
            }

            function register(email, password){
                return $http.post(`${myapi_link}/account/register/`, {
                    email: email, password: password
                }).then(registerSuccessFn, registerErrorFn);

                function registerSuccessFn(data, status, headers, config){
                    return data;
                }

                function registerErrorFn(data, status, headers, config){
                    console.log("Register Failure");
                    return data;
                }
            }

            function fetchYearSection(){
                return $http.get(`${myapi_link}/account/year-section/`)
                    .then(response=>response, response=>response)
            }

            function updateUserProfile(user_profile){
                return $http.put(`${myapi_link}/account/user-profile/`, user_profile)
                    .then(response => response, response => response);
            }

            function unAuthenticate(){
                // remove authentication cookie
                $cookies.remove('authenticatedAccount');
            }

            function isAuthenticated(){
                return !!$cookies.getObject('authenticatedAccount');
            }

            function authenticatedOrRedirect(){
                let isAuthenticated = Authentication.isAuthenticated();
                if(!isAuthenticated) $location.path('/login');
                return !isAuthenticated;

            }

            function setAuthenticatedAccount(account){
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.putObject('authenticatedAccount', account, {'expires':expireDate});
                // set authorization header
                Authentication.setAuthorizationHeader();
            }

            function getAuthenticatedAccount(){
                let account = $cookies.getObject('authenticatedAccount')
                if(!account) return;
                return account;
            }

            function setAuthorizationHeader(){
                $http.defaults.headers.common['Authorization'] = "Token " + Authentication.getAuthenticatedAccount().token;
                console.log("Authentication Header Set");
            }
        }
})();