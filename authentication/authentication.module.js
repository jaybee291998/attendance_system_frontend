(function(){
   'use strict';
   
   angular.module('attendancehub.authentication', [
        'attendancehub.authentication.services',
        'attendancehub.authentication.controllers'
   ]);

   angular.module('attendancehub.authentication.services', ['ngCookies']);
   angular.module('attendancehub.authentication.controllers', []);
})();