//data = [{name="x", data:[1,3,5]},{name="x", data:[1,3,5]}]

function generateBarChart(id, title, data, candidat){
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
          categories: [
              candidat
          ],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'titre y'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
      series: data
  });
}
