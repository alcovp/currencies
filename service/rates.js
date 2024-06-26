const {formatNumber} = require("../util");
var Client = require('coinbase').Client;
var coinbase = new Client(
    {
        'apiKey': 'API KEY',
        'apiSecret': 'API SECRET',
        'strictSSL': false
    }
);
const fetch = require('node-fetch')

function getRates(currency, callback) {
    if (currency.code === 'TON') {
        fetch(
            `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&id=${currency.id}&convert=USD`,
            {method: 'GET', headers: {'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY}}
        )
            .then(response => response.json())
            .then(response => {
                callback(null, {
                    currency: currency.code,
                    rates: {
                        USD: response.data.quote.USD.price,
                        RUB: -1,
                        AMD: -1,
                        GEL: -1,
                    }
                })
            })
            .catch(callback)
    } else {
        coinbase.getExchangeRates({'currency': currency.code}, function (err, response) {
            if (response) {
                callback(null, response.data);
            } else {
                callback(err.stack);
            }
        });
    }
}

function getSummary(callback) {
    const usd = process.env.USD || 1;
    const btc = process.env.BTC || 1;
    getRates({id: 1, code: 'BTC'}, function (err, data) {
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

function getBalance(balance, callback) {
    getRates({id: 1, code: 'BTC'}, function (err, data) {
        if (data) {
            const btcUsdRates = data.rates.USD;
            const btcRubRates = data.rates.RUB;

            var output = "";
            const usdRubRates = btcRubRates / btcUsdRates;
            output += balance + " BTC\n";
            output += formatNumber(btcUsdRates * balance) + " USD\n";
            output += formatNumber(btcRubRates * balance) + " RUB\n";
            callback(null, output);
        } else {
            callback(err);
        }
    })
}

module.exports = {
    getRates,
    getSummary,
    getBalance
}