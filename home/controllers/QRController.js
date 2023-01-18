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
			width : 300,
			height : 300
		});
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;

        let year_level = $scope.year_levels.filter(year_level => year_level.id === parseInt($scope.user_profile.year_level))[0];
        let section = $scope.sections.filter(section => section.id === parseInt($scope.user_profile.section))[0];
        $scope.cred = `${year_level.name} - ${section.name}`;
        qrcode.makeCode($scope.user_profile.qr_code);
        // qrcode.makeCode("qrcode.makeCode($scope.user_profile.qr_code); lksajdfkljsldjalsjkdljkasldjkk");
    }
})();