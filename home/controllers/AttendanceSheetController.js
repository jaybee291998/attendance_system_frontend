(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('AttendanceSheetController', AttendanceSheetController);
    
    AttendanceSheetController.$inject = ['$scope', '$sce', '$location', '$routeParams', 'Authentication', 'DateUtil'];

    function AttendanceSheetController($scope, $sce, $location, $routeParams, Authentication, DateUtil){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isInstructorOrRedirect())return;

        $scope.period_id = $routeParams.period_id;
        $scope.subjects = Authentication.getSubjects();
        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;

        let period = Authentication.getPeriods().filter(period => period.id === parseInt($scope.period_id))[0];
        let named_period = Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects);
        $scope.period_name = `${named_period.subject} - ${named_period.year_level} ${named_period.section}`;
        $scope.start_date = new Date(DateUtil.dateToString(new Date));
        $scope.end_date = new Date(DateUtil.dateToString(new Date));
        $scope.start_date_str = DateUtil.dateToString($scope.start_date);
        $scope.end_date_str = DateUtil.dateToString($scope.end_date);
        let max_date = new Date();
        max_date.setDate(max_date.getDate() + 1);
        $scope.min_date = DateUtil.dateToString(new Date());
        $scope.max_date = DateUtil.dateToString(max_date);
        $scope.date_change = () => {
            // console.log($scope.start_date.toString().slice(4,15));
            console.log("start_date:" + DateUtil.dateToString($scope.start_date));
            // console.log(max_date);
            // console.log(DateUtil.dateToString(max_date));
            console.log($scope.start_date);
            $scope.min_date = DateUtil.dateToString($scope.start_date);
            console.log("end_date: " + DateUtil.dateToString($scope.end_date));

            
        }

        $scope.succ = response => {
            // console.log(response.data);
            let processed_attendance_records = processAttendanceRecords(response.data.attendance_records);
            console.log({processed_attendance_records: processed_attendance_records});
            // console.log(processed_attendance_records);
            let {user_attendance, student_list} = getUserAttendance(processed_attendance_records, response.data.students);
            let date_range = getDateRange($scope.start_date, $scope.end_date);
            console.log({date_range:date_range});
            console.log(user_attendance);
            // console.log(student_list);
            // console.log(a.sort((n, m)=> n > m));
            let sorted_student_list = student_list.sort((n,m)=>{
                let fn = n.toLowerCase();
                let fm = m.toLowerCase();

                if(fn < fm) return -1;

                if(fn > fm) return 1;
                return 0;
            });
            console.log(sorted_student_list);
            let {table_header, table_body} = generateTableData(user_attendance, date_range, sorted_student_list);
            $scope.table_headers = table_header;
            $scope.table_body = table_body;
        }
        
        $scope.checkify = (d) => {
            if(parseInt(d)=== 1) return $sce.trustAsHtml("&#9989;");
            return d;
        }
        $scope.check = $sce.trustAsHtml("&#9989;");
        function generateTableData(user_attendance, date_range, student_list){
            let table_header = [""];
            date_range.forEach(date => {
                table_header.push(DateUtil.dateToString(date));
            });

            let table_body = [];
            student_list.forEach(student_name => {
                let user = user_attendance[student_name];
                // console.log(user);
                let table_row = [student_name];
                date_range.forEach(date => {
                    let found = false;
                    for(let i = 0; i < user.length; i++){
                        // console.log(user[i]);
                        if(user[i].getDate() === date.getDate()){
                            found = true;
                            break;
                        }
                    }
                    if(found){
                        table_row.push(1);
                    }else{
                        table_row.push(0);
                    }
                });
                table_body.push(table_row);
            });
            console.log(table_header);
            console.log(table_body);
            return {table_header: table_header, table_body: table_body};
        }

        $scope.err = response => {
            console.log(response.data);
        }

        $scope.fetch_records = () => {
            $scope.start_date_str = DateUtil.dateToString($scope.start_date);
            $scope.end_date_str = DateUtil.dateToString($scope.end_date);
            // console.log($scope.start_date.getDate());
            Authentication.fetchAttendanceRecords($scope.period_id, $scope.start_date_str, $scope.end_date_str, $scope.succ, $scope.err);
        }
        Authentication.fetchAttendanceRecords($scope.period_id, $scope.start_date_str, $scope.end_date_str, $scope.succ, $scope.err);

        function getDateRange(start_date, end_date){
            let dates = [];
            let new_date = new Date(start_date);
            while(new_date.getTime() < end_date.getTime()){
                dates.push(new Date(new_date));
                new_date.setDate(new_date.getDate() + 1);
                // new_date = new_date.addDays(1);
            }
            dates.push(end_date);
            return dates;
        }
        function getUserAttendance(processed_attendance_records, students){
            let user_attendance = {};
            let student_list = [];
            students.forEach(student => {
                let full_name = `${student.last_name}, ${student.first_name}`;
                user_attendance[full_name] = processed_attendance_records[student.user] != null? processed_attendance_records[student.user]: [];
                student_list.push(full_name);

            });

            return {user_attendance: user_attendance, student_list: student_list};
        }

        // process a list of attendance records so that it will be dictionary with keys that is the user_profile
        function processAttendanceRecords(attendance_records){
            let new_attendance_record = {};
            attendance_records.forEach(attendance_record => {
                let new_date = new Date(attendance_record['timestamp'].slice(0, 10));
                // console.log(attendance_record['timestamp'].slice(0, 10));
                if(attendance_record['user_profile'] in new_attendance_record){
                    new_attendance_record[attendance_record['user_profile']].push(new_date);
                }else{
                    new_attendance_record[attendance_record['user_profile']] = [new_date];
                }
            });
            return new_attendance_record;
        } 

        $scope.export_to_excel = (type, fn, dl) => {
            var elt = document.getElementById('tbl_exporttable_to_xls');
            var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
            let file_name = `${$scope.period_name} from ${$scope.start_date_str} to ${$scope.end_date_str}`;
            return dl ?
                XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
                XLSX.writeFile(wb, fn || (file_name + '.' + (type || 'xlsx')));
        }

        console.log(period);

    }
})();