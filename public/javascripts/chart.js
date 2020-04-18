function createChart(contextId, data) {
    var labels = data.map(function (item) {
        return new Date(item.date);
    });
    var usdValues = data.map(function (item) {
        return Number.parseFloat(item.usdRate);
    });
    var rubValues = data.map(function (item) {
        return Number.parseFloat(item.rubRate);
    });
    var minValue = Math.min(...usdValues);
    var maxValue = Math.max(...usdValues);
    var divisor = 1000;
    var minQuotient = Math.floor(minValue / divisor);
    var maxQuotient = Math.floor(maxValue / divisor) + 1;
    var min = minQuotient * divisor;
    var max = maxQuotient * divisor;

    var context = document.getElementById(contextId);
    var chart = new Chart(context, {
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'USD-BTC',
                    data: usdValues,
                    backgroundColor: 'rgba(133,186,101, 0.2)',
                    borderColor: 'rgb(133,186,101)',
                    type: 'line',
                    pointRadius: 0,
                    fill: false,
                    lineTension: 0,
                    borderWidth: 3,
                    yAxisID: 'y-axis-usd'
                },
                {
                    label: 'RUB-BTC',
                    data: rubValues,
                    backgroundColor: 'rgba(226,208,145, 0.2)',
                    borderColor: 'rgb(226,208,145)',
                    type: 'line',
                    pointRadius: 0,
                    fill: false,
                    lineTension: 0,
                    borderWidth: 3,
                    yAxisID: 'y-axis-rub'
                }
            ]
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
                yAxes: [
                    {
                        ticks: {
                            stepSize: 100,
                        },
                        position: 'left',
                        id: 'y-axis-usd'
                    },
                    {
                        position: 'right',
                        id: 'y-axis-rub',
                        gridLines: {
                            drawOnChartArea: false
                        }
                    }
                ]
            }
        }
    });
}