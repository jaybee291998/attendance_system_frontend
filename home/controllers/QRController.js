(function(){
    'use strict';
    angular
        .module('attendancehub.home.controllers')
        .controller('QRController', QRController);

    QRController.$inject = ['$scope', '$location', 'Authentication'];

    function QRController($scope, $location, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        $scope.user_profile = Authentication.getUserProfile();
        console.log($scope.user_profile.qr_code);
		let qrcode = new QRCode(document.getElementById("qrcode"), {
			width : 100,
			height : 100
		});

        qrcode.makeCode($scope.user_profile.qr_code);
        // qrcode.makeCode("qrcode.makeCode($scope.user_profile.qr_code); lksajdfkljsldjalsjkdljkasldjkk");
    }
})();