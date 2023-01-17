(function(){
    'use strict';

    angular.module('attendancehub.util.dates')
        .factory('DateUtil', DateUtil);
    
    const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months_short = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function DateUtil(){
        let DateUtil = {
            test: test,
            convert_date: convert_date,
            convert_time: convert_time,
            processDateStr: processDateStr,
            dateToString: dateToString,
        }

        return DateUtil;

        function test(){
            console.log("success");
        }

        // convert raw timestamp into a more huma readbable format
        function convert_date(raw_date){
            const year_str = raw_date.substr(0, 4);
            const month_str = raw_date.substr(5, 2);
            const day_str = raw_date.substr(8, 2);

            return `${months[parseInt(month_str)]} ${day_str}, ${year_str}`
        }

        function convert_time(raw_time){
            let hour = parseInt(raw_time.substr(0, 2));
            let timestamp = 'AM';
            if(hour > 12){
                timestamp = 'PM';
                hour -= 12;
            }
            if(hour >= 12) timestamp = 'PM';

            return `${hour}${raw_time.slice(2)} ${timestamp}`;
        }

        function processDateStr(date_str){
            const date = convert_date(date_str.slice(0, 10));
            const time = convert_time(date_str.slice(11, 19));
            return `${date} ${time}`;
        }

        function dateToString(date){
            let raw_date_str = date.toString();
            let date_str = raw_date_str.slice(4,15);
            let month_str = date_str.slice(0,3);
            let day_str = date_str.slice(4, 6);
            let year_str = date_str.slice(7);

            for(let i = 1; i < months_short.length; i++){
                if(months_short[i] === month_str) month_str = ''+i;
            }
            if(month_str.length == 1) month_str = '0'+month_str;
            if(day_str.length == 1) day_str = '0'+day_str;

            return `${year_str}-${month_str}-${day_str}`;
        }
    }
})();