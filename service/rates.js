var Client = require('coinbase').Client;
var client = new Client(
    {
        'apiKey': 'API KEY',
        'apiSecret': 'API SECRET',
        'strictSSL': false
    }
);

function getRates(currencyCode3, callback) {
    client.getExchangeRates({'currency': currencyCode3}, function (err, response) {
        if (response) {
            callback(null, response.data);
        } else {
            callback(err.stack);
        }
    });
}

function getSummary(callback) {
    const usd = process.env.USD || 1;
    const btc = process.env.BTC || 1;
    getRates('BTC', function (err, data) {
        if (data) {
            const btcUsdRates = data.rates.USD;
            const btcRubRates = data.rates.RUB;

            var output = "";
            const usdRubRates = btcRubRates / btcUsdRates;
            output += data.currency + ": " + formatNumber(btcUsdRates) + " USD\n";
            output += data.currency + ": " + formatNumber(btcRubRates) + " RUB\n";
            output += formatNumber(btcUsdRates * btc) + " USD\n";
            output += formatNumber(btcRubRates * btc) + " RUB\n";
            output += "USD: " + formatNumber(usdRubRates) + " RUB\n";
            output += formatNumber(usdRubRates * usd);
            callback(null, output);
        } else {
            callback(err);
        }
    })
}

module.exports = {
    getRates,
    getSummary
}