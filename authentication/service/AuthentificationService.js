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
                fetchAllRegisteredUser: fetchAllRegisteredUser,
                updateUserProfile: updateUserProfile,
                isAuthenticated: isAuthenticated,
                setAuthenticatedAccount: setAuthenticatedAccount,
                getAuthenticatedAccount: getAuthenticatedAccount,
                unAuthenticate: unAuthenticate,
                authenticatedOrRedirect: authenticatedOrRedirect,
                setAuthorizationHeader: setAuthorizationHeader,
                getUserProfile: getUserProfile,
                setUserProfile: setUserProfile,
                registerUserWithProfile: registerUserWithProfile,
                setYearSection: setYearSection,
                getYearSection: getYearSection,
                isInstructorOrRedirect: isInstructorOrRedirect,
                isInstructor: isInstructor,
                setVerifiedUsers: setVerifiedUsers,
                getVerifiedUser: getVerifiedUser,
                isVerifiedUsersLoaded: isVerifiedUsersLoaded,
                processRegisteredUserData: processRegisteredUserData,
                setVerified: setVerified,
                setVerifiedOnce: setVerifiedOnce,
                fetchSubjects: fetchSubjects,
                setSubjects: setSubjects,
                getSubjects: getSubjects,
                isSubjectSet: isSubjectSet,
                initSubjects: initSubjects,
                createPeriod: createPeriod,
                fetchPeriods: fetchPeriods,
                fetchRelatedPeriods: fetchRelatedPeriods,
                setPeriods: setPeriods,
                getPeriods: getPeriods,
                isPeriodSet: isPeriodSet,
                initPeriods: initPeriods,
                initPeriodsOnce: initPeriodsOnce,
                period_to_named_period: period_to_named_period,
                postAttendanceRecords: postAttendanceRecords,
                fetchAttendanceRecords: fetchAttendanceRecords,
                fetchRelatedAttendanceRecords: fetchRelatedAttendanceRecords,
                copyRelatedAttendanceRecords: copyRelatedAttendanceRecords,
                fetchSectionRecords: fetchSectionRecords,
                section_to_string: section_to_string,
                isAdmin: isAdmin,
                isInstructorOrAdminOrRedirect: isInstructorOrAdminOrRedirect,
                isAdminOrRedirect: isAdminOrRedirect,
                setAllInstructors: setAllInstructors,
                getAllInstructors: getAllInstructors,
                fetchAllMembers: fetchAllMembers,
                isAllInstructorsSet: isAllInstructorsSet,
                initAllInstructors: initAllInstructors,
                fetchInstructorshipRequest: fetchInstructorshipRequest,
                requestInstructorship: requestInstructorship,
                postStatusRequest: postStatusRequest,
                unsetSession: unsetSession,
                unsetUserSession: unsetUserSession,

            }

            return Authentication;

            function login(email, password){
                return $http.post(`${myapi_link}/account/login/`, {
                    email: email, password: password
                }).then(loginSuccessFn, loginErrorFn);

                function loginSuccessFn(response){
                    Authentication.setAuthenticatedAccount(response.data);
                    Authentication.setUserProfile(response.data.profile);
                    if(Authentication.isInstructor())Authentication.initPeriods();
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

            function registerUserWithProfile(user, user_profile, role){
                let data = {user:user, user_profile:user_profile}
                return $http.post(`${myapi_link}/account/register-with-profile/?role=${role}`, data)
                .then(response=>response, response=>response);
            }

            function fetchAllRegisteredUser(){
                return $http.get(`${myapi_link}/account/get-all-registered-user/`)
                    .then(response => response, response => response);
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
                if(!isAuthenticated) $location.path('/ict');
                return !isAuthenticated;

            }

            function setAuthenticatedAccount(account){
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.putObject('authenticatedAccount', account, {'expires':expireDate});
                // set authorization header
                Authentication.setAuthorizationHeader();
            }

            function setUserProfile(user_profile){
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 1);
                $cookies.putObject('userProfile', user_profile, {'expires':expireDate});
            }

            function getUserProfile(){
                let user_profile = $cookies.getObject('userProfile');
                if(!user_profile) return;
                return user_profile;
            }

            function getAuthenticatedAccount(){
                let account = $cookies.getObject('authenticatedAccount');
                if(!account) return;
                return account;
            }

            function setAuthorizationHeader(){
                $http.defaults.headers.common['Authorization'] = "Token " + Authentication.getAuthenticatedAccount().token;
                console.log("Authentication Header Set");
            }

            function setYearSection(year_levels, sections){
                let data = {
                    year_levels: year_levels,
                    sections: sections
                };
                let str = JSON.stringify(data);
                sessionStorage.setItem('year_section', str);
            }

            function getYearSection(){
                let year_section = sessionStorage.getItem('year_section');
                if(!year_section) return;
                return JSON.parse(year_section);
            } 

            function isInstructorOrRedirect(){
                let isInstructor = Authentication.isInstructor();
                console.log("Is Instructor" + isInstructor);
                if(!isInstructor) $location.path('/');
                return !isInstructor;
            }

            function isInstructorOrAdminOrRedirect(){
                let user_profile = Authentication.getUserProfile();
                let isInstructorOrAdmin = user_profile.role === 'I' || user_profile.role ==='A';
                if(!isInstructorOrAdmin) $location.path('/');
                return !isInstructorOrAdmin;
            }

            function isInstructor(){
                let user_profile = Authentication.getUserProfile();
                let isInstructor = user_profile.role === 'I';
                console.log("Is Instructor" + isInstructor);
                return isInstructor;
            }

            function isAdmin(){
                let user_profile = Authentication.getUserProfile();
                let isAdmin = user_profile.role === 'A';
                console.log("Is Admin: " + isAdmin);
                return isAdmin;
            }

            function isAdminOrRedirect(){
                let isAdmin = Authentication.isAdmin();
                if(!isAdmin) $location.path('/');
                return !isAdmin;
            }

            function processRegisteredUserData(registered_users){
                let newData = {};
                registered_users.forEach(registered_user => {
                    let qr_code = registered_user.qr_code;
                    newData[qr_code] = [];
                    let full_name = `${registered_user.first_name} ${registered_user.last_name}`;
                    newData[qr_code].push(full_name);
                    newData[qr_code].push(registered_user.year_level);
                    newData[qr_code].push(registered_user.section);

                });
                return newData;
            }

            function setVerifiedUsers(verifiedUsers){
                let verifiedUsersStr = JSON.stringify(verifiedUsers);
                sessionStorage.setItem('verifiedUsers', verifiedUsersStr);
            }

            function getVerifiedUser(){
                let verifiedUsers = sessionStorage.getItem('verifiedUsers');
                if(!verifiedUsers) return;
                return JSON.parse(verifiedUsers);
            }

            function isSessionSet(cookie_name){
                let session = sessionStorage.getItem(cookie_name);
                if(session) return true;
                return false;
            }

            function setSession(cookie_name, data){
                let data_str = JSON.stringify(data);
                sessionStorage.setItem(cookie_name, data_str);
            }

            function getSession(cookie_name){
                let session = sessionStorage.getItem(cookie_name);
                if(!session) return;
                return JSON.parse(session);
            }

            function isVerifiedUsersLoaded(){
                let verifiedUsers = sessionStorage.getItem('verifiedUsers');
                if(verifiedUsers) return true;
                return false;
            }

            function setVerifiedOnce(){
                if(Authentication.isVerifiedUsersLoaded()) return;
                console.log("Successfully Called set verified once");
                Authentication.setVerified();

            }

            function setVerified(){
                console.log("Set Verified called");
                let p = Authentication.fetchAllRegisteredUser();
                p.then(response => {
                    if(response.status >= 200 && response.status <= 299){
                        // console.log(response.data);
                        let processed = Authentication.processRegisteredUserData(response.data);
                        Authentication.setVerifiedUsers(processed);
                        console.log(processed);
                       }else{
                        console.log(response);
                     }
                 });
            }

            function setSubjects(subjects){
                setSession('subjects', subjects);
            }

            function getSubjects(){
                return getSession('subjects');
            }

            function isSubjectSet(){
                return isSessionSet('subjects');
            }

            function fetchSubjects(){
                return $http.get(`${myapi_link}/account/subjects/`)
                    .then(response=>response, response=>response);
            }

            function initSubjects(){
                console.log("Initializing Subjects");
                let p = Authentication.fetchSubjects();
                p.then(response => {
                    if(response.status >= 200 && response.status <= 299){
                        let data = response.data;
                        console.log(data);
                        Authentication.setSubjects(data);
                    }else{
                        console.error("Error fethcing subjects");
                        console.error(response);
                    }
                })
            }

            function createPeriod(period, succ, err){
                return $http.post(`${myapi_link}/account/period-list/`, period)
                    .then(succ, err);
            }

            function fetchPeriods(succ, err){
                return $http.get(`${myapi_link}/account/period-list/`)
                        .then(succ, err);
            }

            function fetchRelatedPeriods(succ, err, period_pk){
                return $http.get(`${myapi_link}/account/period-list/?period_pk=${period_pk}`)
                        .then(succ, err);
            }

            function setPeriods(periods){
                setSession('periods', periods);
            }

            function getPeriods(){
                return getSession('periods');
            }

            function isPeriodSet(){
                return isSessionSet('periods');
            }

            function initPeriods(){
                console.warn("Init periods");
                let p = Authentication.fetchPeriods(succ, err);
                function succ(response){
                    let data = response.data;
                    Authentication.setPeriods(data);
                    console.log(data);
                }

                function err(response){
                    console.error(response);
                }
            }

            function initPeriodsOnce(){
                console.warn("Init periods once");
                // console.warn(isPeriodSet())
                if(!isPeriodSet()) Authentication.initPeriods();
            }

            function period_to_named_period(period, year_levels, sections, subjects){
                let subject_id = period.subject;
                let subject_name = subjects.filter(subject => subject.id === parseInt(subject_id))[0].name;
                let section_id = period.section;
                let selected_section = sections.filter(section => section.id === parseInt(section_id))[0];
                let section_name = selected_section.name;
                let year_level_section =  selected_section.year_level;
                let year_level_name = year_levels.filter(year_level => year_level.id === parseInt(year_level_section))[0].name;
                let d = {
                    id:period.id,
                    subject: subject_name,
                    year_level: year_level_name,
                    section: section_name
                }
                return d;
            }

            function section_to_string(section_id, year_levels, sections){
                let section = sections.filter(section => section.id == section_id)[0];
                let year_id = section.year_level
                let year_level = year_levels.filter(year_level => year_level.id == year_id)[0];
                return `${year_level.name} ${section.name}`;
            }

            function postAttendanceRecords(attendance_records, period_id, succ, err){
                return $http.post(`${myapi_link}/attendance/attendance-records/${period_id}/`, attendance_records)
                    .then(succ, err);
            }

            function fetchAttendanceRecords(period_id, start_date, end_date, succ, err){
                return $http.get(`${myapi_link}/attendance/attendance-records/${period_id}/?start_date=${start_date}&end_date=${end_date}`)
                    .then(succ, err);
            }

            function fetchRelatedAttendanceRecords(period_id, period_to_copy_id, succ, err){
                return $http.get(`${myapi_link}/attendance/attendance-records/${period_id}/?period_to_copy=${period_to_copy_id}`)
                    .then(succ, err);
            }

            function copyRelatedAttendanceRecords(period_id, period_to_copy_id, succ, err){
                return $http.put(`${myapi_link}/attendance/attendance-records/${period_id}/?period_to_copy=${period_to_copy_id}`)
                    .then(succ, err);
            }

            function fetchSectionRecords(section_id, date, succ, err){
                return $http.get(`${myapi_link}/attendance/section-records/${section_id}?start_date=${date}`)
                    .then(succ, err);
            }
            function fetchAllMembers(role, succ, err){
                return $http.get(`${myapi_link}/account/get-all-members/?role=${role}`)
                    .then(succ, err);
            }

            function setAllInstructors(all_instructors){
                setSession('allInstructors', all_instructors);
            }

            function getAllInstructors(){
                return getSession('allInstructors');
            }

            function isAllInstructorsSet(){
                return isSessionSet('allInstructors');
            }

            function initAllInstructors(){
                console.warn("Init All Instructors");
                let p = Authentication.fetchAllMembers('I', succ, err);
                function succ(response){
                    let data = response.data;
                    Authentication.setAllInstructors(data);
                    console.log(data);
                }

                function err(response){
                    console.error(response);
                }
            }

            function fetchInstructorshipRequest(succ, err){
                return $http.get(`${myapi_link}/account/request-instructorship-list/`)
                    .then(succ, err);
            }

            function requestInstructorship(succ, err, role){
                return $http.post(`${myapi_link}/account/request-instructorship-list/?role=${role}`)
                .then(succ, err);
            }

            function postStatusRequest(request_id, status, succ, err){
                return $http.put(`${myapi_link}/account/request-instructorship-detail/${request_id}/?status=${status}`)
                    .then(succ, err);
            }

            function unsetSession(cookie_name){
                sessionStorage.removeItem(cookie_name);
            }

            function unsetUserSession(){
                Authentication.unsetSession('periods');

            }
        }
})();