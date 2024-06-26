const fetch = require("node-fetch");
const {response} = require("express");
const env = require('dotenv').config({path: __dirname + '/./../.env'});

const currencies = [
    {id: 1, code: 'BTC'},
    {id: 11419, code: 'TON'},
    {id: 28850, code: 'NOT'},
]

currencies.forEach(curr => {
    fetch(
        `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&id=${curr.id}&convert=USD`,
        {method: 'GET', headers: {'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY}}
    )
        .then(response => response.json())
        .then(response => {
            console.log(curr.code + ': ' + response.data.quote.USD.price)
        })
        .catch(console.error)
})