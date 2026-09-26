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

const coinMarketCapCurrencies = new Set(['TON', 'NOT'])

function getRates(currency, callback) {
    if (coinMarketCapCurrencies.has(currency.code)) {
        getCoinMarketCapRates([currency], callback)
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

// The callback is invoked for each available currency, as with getRates.
function getRatesForCurrencies(currencies, callback) {
    currencies.filter(currency => !coinMarketCapCurrencies.has(currency.code))
        .forEach(currency => getRates(currency, callback))
    const cmcCurrencies = currencies.filter(currency => coinMarketCapCurrencies.has(currency.code))
    if (cmcCurrencies.length) {
        getCoinMarketCapRates(cmcCurrencies, callback)
    }
}

function getCoinMarketCapRates(currencies, callback) {
    const ids = currencies.map(currency => currency.id).join(',')
    fetch(
        `https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest?id=${ids}&convert=USD`,
        {method: 'GET', headers: {'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY}, timeout: 10000}
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`CoinMarketCap HTTP ${response.status}`)
            }
            return response.json()
        })
        .then(response => {
            if (!response || !response.status || Number(response.status.error_code) !== 0
                || !Array.isArray(response.data)) {
                throw new Error('CoinMarketCap returned an API error or invalid quotes')
            }
            return response.data
        })
        .then(data => {
            currencies.forEach(currency => {
                const asset = data.find(asset => asset && asset.id === currency.id)
                const quote = asset && Array.isArray(asset.quote)
                    && asset.quote.find(quote => quote && quote.symbol === 'USD')
                if (!quote || !Number.isFinite(quote.price) || quote.price <= 0) {
                    callback(new Error(`CoinMarketCap: missing or invalid USD price for ${currency.code}`))
                    return
                }
                callback(null, {
                    currency: currency.code,
                    rates: {
                        USD: quote.price,
                        RUB: -1,
                        AMD: -1,
                        GEL: -1,
                    }
                })
            })
        }, callback)
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
    getRatesForCurrencies,
    getSummary,
    getBalance
}
