//data = [{name="x", data:[[1,3,5],[1,3,5],[1,3,5]]},{name="x", data:[[1,3,5],[1,3,5],[1,3,5]]}]

function generateBarChartMultibleBar(id, title, title_y, data, candidat){
  Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Monthly Average Rainfall'
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        categories: [
            data
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">'+title_y+': </td>' +
            '<td style="padding:0"><b>{point.y} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: '',
        data: data

    }]
});
}
