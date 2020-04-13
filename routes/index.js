var express = require('express');
const rates = require("../service/rates");
const {formatNumber} = require("../util");
const {wrapPreformattedText} = require("../util");
var router = express.Router();

router.get('/', function (req, res, next) {
    const usd = process.env.USD || 1;
    const btc = process.env.BTC || 1;
    rates.getRates('BTC', function (err, data) {
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
            res.render('index', {text: wrapPreformattedText(output)});
        } else {
            res.render('index', {text: wrapPreformattedText(err)});
        }
    });
});

module.exports = router;
