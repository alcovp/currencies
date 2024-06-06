const {formatNumber} = require("../util");
var Client = require('coinbase').Client;
var client = new Client(
    {
        'apiKey': 'API KEY',
        'apiSecret': 'API SECRET',
        'strictSSL': false
    }
);

const callback = function (err, data) {
    if (data) {
        console.log(data.rates.USD);
    } else {
        console.error(err);
    }
}

client.getExchangeRates({'currency': 'TON'}, function (err, response) {
    if (response) {
        callback(null, response.data);
    } else {
        callback(err.stack);
    }
});