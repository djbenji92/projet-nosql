//data = [{name="x", data:[1,3,5]},{name="x", data:[1,3,5]}]

function generateBarChart(id, title, title_y, data, candidat){
  Highcharts.chart(id, {
    chart: {
        type: 'column'
    },
    title: {
        text: title
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: title_y+': <b>{point.y}</b>'
    },
    series: [{
        name: '',
        data: data,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y}',    
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});
}
