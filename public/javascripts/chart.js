function createChart(contextId, data) {
    var labels = data.map(function (item) {
        return new Date(item.date);
    });
    var values = data.map(function (item) {
        return Number.parseFloat(item.usdRate);
    });
    var minValue = Math.min(...values);
    var maxValue = Math.max(...values);
    var divisor = 1000;
    var minQuotient = Math.floor(minValue / divisor);
    var maxQuotient = Math.floor(maxValue / divisor) + 1;
    var min = minQuotient * divisor;
    var max = maxQuotient * divisor;

    var context = document.getElementById(contextId);
    var chart = new Chart(context, {
        data: {
            labels: labels,
            datasets: [{
                label: 'BTC today',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                type: 'line',
                pointRadius: 2,
                fill: true,
                lineTension: 0,
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        parser: 'MM/DD/YYYY HH:mm',
                        tooltipFormat: 'DD.MM.YYYY HH:mm',
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
                        }
                    }
                }],
                yAxes: [{
                    ticks: {
                        stepSize: 100,
                    }
                }]
            }
        }
    });
}