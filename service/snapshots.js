const {Snapshot} = require("../models/snapshot");
var moment = require('moment');

function saveSnapshot(data) {
    const btcUsdRates = data.rates.USD;
    const btcRubRates = data.rates.RUB;
    const snapshot = new Snapshot({
        date: new Date(),
        currencyName: data.currency,
        usdRate: btcUsdRates,
        rubRate: btcRubRates
    });
    return snapshot.save();
}

function getSnapshots() {
    return Snapshot
        .find({})
        .select('-_id date currencyName usdRate rubRate')
        .sort('date')
        .exec();
}

function getSnapshotsInLast24Hours() {
    const aDayAgo = moment().subtract(24, 'hours').toDate();
    return Snapshot
        .find({})
        .select('-_id date currencyName usdRate rubRate')
        .where('date').gt(aDayAgo)
        .sort('date')
        .exec();
}

function getNewestSnapshot() {
    return Snapshot
        .findOne({})
        .select('-_id date currencyName usdRate rubRate')
        .sort('-date')
        .exec();
}

function deleteOldSnapshots() {
    const aMonthAgo = moment().subtract(30, 'days').toDate();
    return Snapshot
        .deleteMany({})
        .where('date').lt(aMonthAgo)
        .exec();
}

module.exports = {
    saveSnapshot,
    getSnapshotsInLast24Hours,
    deleteOldSnapshots,
    getNewestSnapshot
}