(function(){
    'use strict';

    angular
        .module('attendancehub.util.charts')
        .factory('ChartUtil', ChartUtil);

    function ChartUtil(){
        let ChartUtil = {
            make_chart: make_chart,
        }
        return ChartUtil;

        function make_chart(chart_data, label, id, chartDiv){
            // create a new canvas inside the canvas div
            const canvasDiv = document.createElement('div');
            const ctx = document.createElement('canvas');
            ctx.id = id;
            
            // create the dataset that will be used by the chart
            let dataset = {
                label: label,
                data: chart_data.data,
                backgroundColor: getRandomColors(chart_data.data.length),
                borderWidth: 1
            }

            // the actual chart object
            var myChart = new Chart(ctx,{
                type: "line",
                data: {
                    labels: chart_data.labels,
                    datasets: [dataset]
                },
                options:{
                    scales:{
                        y:{
                            // beginAtZero:true
                        }
                    }
                }
            });

            canvasDiv.appendChild(ctx);
            chartDiv.appendChild(canvasDiv);

            return myChart;

        }
        // generate a random rgba color
        function randomColor(){
            var o = Math.round, r = Math.random, s = 255;
            return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
        }
        // get an array of random rgba colors
        function getRandomColors(size){
            var colors = []
            for(var i = 0; i < size; i++){
                colors.push(randomColor());
            }
            return colors;
        }
    }
})();