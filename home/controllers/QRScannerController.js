(function(){
    'use strict';

    angular
        .module("attendancehub.home.controllers")
        .controller("QRScannerController", QRScannerController);

    QRScannerController.$inject = ['$scope', '$location', '$routeParams', '$timeout', 'Authentication'];

    function QRScannerController($scope, $location, $routeParams, $timeout, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isInstructorOrRedirect())return;
        $scope.period_id = $routeParams.period_id;
        const video = document.getElementById('qr-video');
        const verifiedUsers = Authentication.getVerifiedUser();
        let scanned_qr_codes = [];
        $scope.scanned_names = [];
        $scope.qr_error = null;
        $scope.current_qr_code = null;
        $scope.current_qr_name = null;
        $scope.show_prompt = false;
        $scope.show_student_list = false;
        $scope.show_video_div = false;
        $scope.show_options = true;

        $scope.subjects = Authentication.getSubjects();
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;

        let period = Authentication.getPeriods().filter(period => period.id === parseInt($scope.period_id))[0];
        let named_period = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
        $scope.period_name = `${named_period.subject} - ${named_period.year_level} ${named_period.section}`;

        console.log(verifiedUsers);

        $scope.$on('$destroy', ()=>{
            $scope.stop();
            console.log("STOPPPEDDD");
        });

        const scanner = new QrScanner(video, setResult, {
            onDecodeError: error => {
                console.log(`QR Error ${error}`);
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
        });

        document.getElementById('start-button').addEventListener('click', () => {
            scanner.start();
        });
    
        document.getElementById('stop-button').addEventListener('click', () => {
            scanner.stop();
        });

        $scope.start = () => {
            scanner.start();
            $scope.show_video_div = true;
        }

        $scope.stop = () => {
            scanner.stop();
            $scope.show_video_div = false;
        }


        $scope.post_attendance = () => {
            console.log(scanned_qr_codes);
        }
        function setResult(result){
            // scanner.stop()
            $scope.stop();
            console.log(result);
            // console.log(`last result ${$scope.scanned_qr_codes.at(-1)}`)
            if(result.data === scanned_qr_codes.at(-1)){
                setQrError("QR code Scanned twice");                
                return;
            }
            let d = verifiedUsers[result.data];
            console.log(d);
            if(!d)
            {
                setQrError("QR code not registered");
                return;
            }

            $scope.current_qr_code = result.data;
            $scope.current_qr_name = d[0];

            $scope.show_prompt = true;
            $scope.$apply();
            // console.log($scope.scanned_qr_codes);
            

        }

        function setQrError(error){
            $scope.qr_error = error;
            $timeout(()=>{
                $scope.qr_error = null;
            }, 2000);
            $scope.$apply();
        }

        $scope.approve = () => {
            $scope.show_prompt = false;
            scanned_qr_codes.push($scope.current_qr_code);
            $scope.scanned_names.push($scope.current_qr_name);
            $scope.show_student_list = true;
            // $scope.$apply();
        }

        $scope.reject = () => {
            $scope.show_prompt = false;
            // $scope.$apply();
        }


        // QrScanner.WORKER_PATH = '../js/qr scanner/qr-scanner-worker.min.js';

    }
})()