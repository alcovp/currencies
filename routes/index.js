var express = require('express');
const rates = require("../service/rates");
const {formatNumber} = require("../util");
const {wrapPreformattedText} = require("../util");
var router = express.Router();

router.get('/', function (req, res, next) {
    rates.getSummary(function (err, data) {
        if (data) {
            res.render('index', {text: wrapPreformattedText(data)});
        } else {
            res.render('index', {text: wrapPreformattedText(err)});
        }
    });
});

module.exports = router;
