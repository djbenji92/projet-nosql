//data = [[0][5],{name="x", y:4}]

function generateBarChart(id, title, title_y, data1, data2){
  Highcharts.chart(id, {
    chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: data1[0]
            
        },
        yAxis: [{
            min: 0,
            title: {
                text: ''
            }
        },{
            title: {
                text: ''
            },
            opposite: true
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tweets retweetés plus de 100 fois',
            color: 'rgba(165,170,217,1)',
            data: data1[0],
            pointPadding: 0.3,
            pointPlacement: -0.2
        }, {
            name: 'Tous les tweets',
            color: 'rgba(126,86,134,.9)',
            data: data2[0],
            pointPadding: 0.4,
            pointPlacement: -0.2
        }]
});
}
