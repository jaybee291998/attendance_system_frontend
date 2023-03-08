(function(){
    'use strict';

    angular
        .module('attendancehub.home.controllers')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$scope', '$routeParams', '$location', 'Authentication', 'DateUtil'];

    function SummaryController($scope, $routeParams, $location, Authentication, DateUtil){
        if(Authentication.authenticatedOrRedirect())return;
        if(Authentication.isAdminOrRedirect())return;
        $scope.section_id = $routeParams.section_id;

        let year_section = Authentication.getYearSection();
        $scope.year_levels = year_section.year_levels;
        $scope.sections = year_section.sections;
        $scope.subjects = Authentication.getSubjects();

        $scope.section = $scope.sections.filter(section => section.id === parseInt($scope.section_id))[0];
        $scope.year_level = $scope.year_levels.filter(year_level => year_level.id === $scope.section.year_level)[0];
        $scope.header_name = `${$scope.year_level.name} - ${$scope.section.name}`;

        $scope.section_periods = null;
        $scope.section_attendance_records = null;
        $scope.section_students = null;
        $scope.named_section_periods = null;
        $scope.student_list = null;

        $scope.start_date = new Date(DateUtil.dateToString(new Date));
        $scope.start_date_str = DateUtil.dateToString($scope.start_date);

        $scope.table_headers = null;
        $scope.table_body = null;
        $scope.summary = null;

        let max_date = new Date();
        max_date.setDate(max_date.getDate() + 1);
        $scope.max_date = DateUtil.dateToString(max_date);

        $scope.date_change = () => {
            console.log("start_date:" + DateUtil.dateToString($scope.start_date));
            console.log($scope.start_date);
        }

        const fetchSectionRecordsSucc = res => {

            console.log(res);

            $scope.section_periods = res.data.periods;
            $scope.section_attendance_records = res.data.attendance_records;
            $scope.section_students = res.data.students;

            console.log($scope.section_attendance_records);

            $scope.named_section_periods = $scope.section_periods.map(period=>Authentication.period_to_named_period(period, $scope.year_levels, $scope.sections, $scope.subjects));
            $scope.student_list = $scope.section_students.map(user => {
                let full_name = `${user.last_name}, ${user.first_name}`;
                return {user_profile:user.user,full_name:full_name};
            });
            $scope.student_list = $scope.student_list.sort((n,m)=>{
                let fn = n.full_name.toLowerCase();
                let fm = m.full_name.toLowerCase();

                if(fn < fm) return -1;

                if(fn > fm) return 1;
                return 0;
            });
            console.log($scope.named_section_periods);
            console.log($scope.student_list);

            let {table_header, table_body, summary} = generateTableData($scope.section_attendance_records, $scope.named_section_periods, $scope.student_list);
            $scope.table_headers = table_header;
            $scope.table_body = table_body;
            $scope.summary = summary;
        }

        const fetchSectionRecordsErr = res => {
            console.error(res);
        }

        $scope.fetch_records = () => {
            $scope.start_date_str = DateUtil.dateToString($scope.start_date);
            // console.log($scope.start_date.getDate());
            Authentication.fetchSectionRecords($scope.section_id, $scope.start_date_str, fetchSectionRecordsSucc, fetchSectionRecordsErr);
        }

        const generateTableData = (attendance_records, periods, student_list) => {
            let table_header = [""];
            periods.forEach(period => {
                table_header.push(period.subject);
            });

            let table_body = [];
            student_list.forEach(student => {
                let row = [student.full_name];
                table_body.push(row);
                periods.forEach(period => {
                    let records = attendance_records[period.id];
                    let record = null;
                    for(let i = 0; i < records.length; i++){
                        let rec = records[i];
                        if(rec.user_profile == student.user_profile){
                            record = rec;
                            break;
                        }
                    }
                    if(record){
                        row.push(record.status);
                    }else{
                        row.push('A');
                    }
                });
            });
            let summary = ["summary"];
            console.log(table_body);
            for(let col = 1; col < table_header.length; col++){
                let total = 0;
                for(let row = 0; row < table_body.length; row++){
                    let stat = table_body[row][col];
                    if(stat == 'P') total++;
                }
                summary.push(`(${total} / ${table_body.length})`);
            }
            return {table_header:table_header, table_body:table_body, summary:summary};
        }

        $scope.export_to_excel = (type, fn, dl) => {
            var elt = document.getElementById('tbl_exporttable_to_xls');
            var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
            let file_name = `${$scope.header_name} on ${$scope.start_date_str}`;
            return dl ?
                XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
                XLSX.writeFile(wb, fn || (file_name + '.' + (type || 'xlsx')));
        }

        $scope.fetch_records();
    }
})();