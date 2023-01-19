(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('AdminPanelController', AdminPanelController);

    AdminPanelController.$inject = ['$scope', '$timeout', 'Authentication'];

    function AdminPanelController($scope, $timeout, Authentication){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isAdminOrRedirect())return;

        $scope.all_members = null;
        $scope.instructorship_requests_raw = null;
        $scope.instructorship_requests = null;
        $scope.page_error = null;
        $scope.show_instructorship_list = false;
        $scope.show_student_list = true;
        $scope.show_instructor_list = false;
        $scope.show_profile = false;

        $scope.selected_profile_id = null; //
        $scope.selected_request_id = null;
        $scope.user = null;
        $scope.is_selected_prof_ins = false;
        $scope.is_selected_prof_req = false;

        $scope.show_filters = true;

        $scope.instructors = [];
        $scope.students = []
        $scope.filtered_students = [];

        $scope.valid_sections_for_filter = [];
        $scope.section_filter_disabled = true;

        $scope.filter_variables = {
            first_name: '',
            last_name: '',
            middle_name: '',
            age: null,
            year_level: null,
            section: null

        }

        $scope.filter = () => {
            console.log($scope.filter_variables);

            $scope.filtered_students = $scope.students.filter(student => {
                return first_name_filter(student.first_name) && last_name_filter(student.last_name) && year_level_filter(student.year_level) && section_filter(student.section);
            });
        }

        function first_name_filter(first_name){
            if($scope.filter_variables.first_name === "") return true;
            return first_name.toLowerCase().match($scope.filter_variables.first_name);
        }

        function last_name_filter(last_name){
            if($scope.filter_variables.last_name === "") return true;
            return last_name.toLowerCase().match($scope.filter_variables.last_name);
        }

        function year_level_filter(year_level){
            if($scope.filter_variables.year_level === null || $scope.filter_variables.year_level === 'none') return true;
            return year_level === parseInt($scope.filter_variables.year_level);
        }

        function section_filter(section){
            if($scope.filter_variables.section === null || $scope.filter_variables.section === 'none') return true;
            return section === parseInt($scope.filter_variables.section)
        }   


        $scope.year_filter_change = () => {
            console.log($scope.filter_variables);
            if($scope.filter_variables.year_level !== 'none'){
                $scope.filter_variables.section = 'none';
                $scope.section_filter_disabled = false;
                $scope.valid_sections_for_filter = $scope.sections.filter(section => section.year_level === parseInt($scope.filter_variables.year_level));
                console.log($scope.valid_sections_for_filter);
            }else{
                $scope.section_filter_disabled = true;
            }
            $scope.filter();
        }

        $scope.sex_choices = [
            {id:'M', name:'Male'},
            {id:'F', name:'Female'},
            {id:'O', name:'Other'}
        ];

        function init(){
            fetchAllMembers();
        }

        $scope.back = () => {
            $scope.show_stud_list();
        }

        init();

        let data = Authentication.getYearSection();
        $scope.year_levels = data.year_levels;
        $scope.sections = data.sections;

        function fetchAllMembers(){
            const succ = response => {
                console.log("Successs");
                console.log(response.data);
                $scope.year_level_dict = {}
                $scope.year_levels.forEach(y => $scope.year_level_dict[y.id] = y.name);
                $scope.section_dict = {}
                $scope.sections.forEach(s => $scope.section_dict[s.id]=s.name);
                $scope.all_members = response.data.map(m => {
                    let new_data = {...m};
                    new_data['year_level_name'] = $scope.year_level_dict[m.year_level];
                    new_data['section_name'] = $scope.section_dict[m.section];
                    if(m.role === 'I') $scope.instructors.push(new_data);
                    else if(m.role == 'S') $scope.students.push(new_data);
                    return new_data;
                });
                console.log($scope.all_members);
                // console.log({students:$scope.students});
                $scope.filter();
                fetchAllInstructorshipRequest();
            }
    
            const err = response => {
                console.log(response.data);
                setPageError(response.data);
            }
            Authentication.fetchAllMembers("", succ, err);
        }

        function fetchAllInstructorshipRequest(){
            const succ = response => {
                console.log("Instructorship Request:");
                $scope.instructorship_requests_raw = response.data.filter(r => r.status == 'P');
                $scope.instructorship_requests = processRawInstructorship($scope.instructorship_requests_raw);
                console.log($scope.instructorship_requests);
                console.log($scope.instructorship_requests_raw);
            }

            const err = response => {
                console.log(response.data);
                setPageError(response.data);
            }

            Authentication.fetchInstructorshipRequest(succ, err);
        }

        function setPageError(error){
            $scope.page_error = error;
            $timeout(()=>{
                $scope.page_error = null;
            }, 10*1000);
        }

        function processRawInstructorship(raws){
            return raws.map(raw => {
                let new_request = {};
                new_request.id = raw.id;
                let requestee = $scope.all_members.filter(m => m.user === raw.requestee)[0];
                new_request.full_name = `${requestee.first_name} ${requestee.last_name}`;
                new_request.requestee = requestee.user;
                return new_request;
            });
        }

        $scope.test = (user_id, request_id) => {
            let d = {user_id: user_id, request_id:request_id};
            console.log(d);
            $scope.selected_profile_id = user_id;
            $scope.user = $scope.all_members.filter(user_prof => user_prof.user === user_id)[0];

            $scope.valid_sections = $scope.sections.filter(section => section.year_level === parseInt($scope.user.year_level));

            $scope.user.year_level = ""+$scope.user.year_level;
            $scope.user.section = ""+$scope.user.section;

            if(request_id){
                $scope.is_selected_prof_req = true;
                $scope.selected_request_id = request_id;
            } else {
                $scope.is_selected_prof_req = false;
                $scope.selected_request_id = null;
            }
            $scope.is_selected_prof_ins = $scope.user.role == 'I';
            $scope.show_prof();
            // console.log();
        }

        $scope.show_req_list = () => {
            $scope.show_instructorship_list = true;
            $scope.show_student_list = false;
            $scope.show_instructor_list = false;
            $scope.show_profile = false;
        }

        $scope.show_stud_list = () => {
            $scope.show_instructorship_list = false;
            $scope.show_student_list = true;
            $scope.show_instructor_list = false;
            $scope.show_profile = false;
        }

        $scope.show_ins_list = () => {
            $scope.show_instructorship_list = false;
            $scope.show_student_list = false;
            $scope.show_instructor_list = true;
            $scope.show_profile = false;
        }

        $scope.show_prof = () => {
            $scope.show_instructorship_list = false;
            $scope.show_student_list = false;
            $scope.show_instructor_list = false;
            $scope.show_profile = true;
        }

        let post_status = (status) => {
            if($scope.selected_request_id){
                const succ = response => {
                    console.log(response);
                    fetchAllInstructorshipRequest();
                    $scope.show_req_list()
                }

                const err = response => {
                    setPageError(response.data);
                }

                Authentication.postStatusRequest($scope.selected_request_id, status, succ, err);
            }else{
                setPageError("No erquest id present");
            }
        }

        $scope.accept = () => {
            // assume it succeeds
            post_status('A');
            $scope.user.role = 'I';
            $scope.instructors.push($scope.user);

        };
        $scope.reject = () => {post_status('R')};
    }
})();