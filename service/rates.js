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

module.exports = {
    getRates
}