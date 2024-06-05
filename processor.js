const rates = require("./service/rates");
const snapshots = require("./service/snapshots");
const schedule = require('node-schedule');
const alerts = require("./service/alerts");
const {memoryCache} = require("./service/snapshots");

const currencies = snapshots.getWatchedCurrencies()

function startFetchRatesJob() {
    const job = schedule.scheduleJob('0 */5 * ? * *', function (fireDate) {
        currencies.forEach((currency) => {
            rates.getRates(currency, function (err, data) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('got new snapshot: ' + data.currency + ' with usd rate: ' + data.rates.USD)
                    snapshots.saveSnapshot(data);
                }
            })
        })
    });
}

function startDeleteOldSnapshotsJob() {
    const job = schedule.scheduleJob('0 0 0 ? * *', function (fireDate) {
        snapshots.deleteOldSnapshots()
            .then(data => {
                console.log(`Old snapshots deleted successfully (${data.deletedCount})`);
                console.log(`The job deleteOldSnapshotsJob was supposed to run at ${fireDate}, but actually ran at ${new Date()}`);
            });
    });
}

function startAnalyzeVolatilityJob() {
    const previousSnapshotsWhichFiredAlert = memoryCache.previousSnapshotsWhichFiredAlert
    const job = schedule.scheduleJob('0 */5 * ? * *', function (fireDate) {
        snapshots.getSnapshotsInLast24Hours()
            .then(allSnapshots => {
                const groupedSnapshots = {}
                allSnapshots.forEach(snapshot => {
                    if (groupedSnapshots[snapshot.currencyName] === undefined) {
                        groupedSnapshots[snapshot.currencyName] = []
                    }
                    groupedSnapshots[snapshot.currencyName].push(snapshot)
                })
                console.log('grouped as: ' + JSON.stringify(groupedSnapshots, null, 4))
                currencies.forEach((currency) => {
                    const snapshots = groupedSnapshots[currency]
                    if (snapshots && snapshots.length > 1) {
                        let oldest = snapshots[0];
                        if (previousSnapshotsWhichFiredAlert.get(currency)
                            && !previousAlertIsTooOld(oldest, currency)) {
                            oldest = previousSnapshotsWhichFiredAlert.get(currency);
                        }
                        const newest = snapshots[snapshots.length - 1];
                        const percentageDifference = (1 - oldest.usdRate / newest.usdRate) * 100;
                        if (Math.abs(percentageDifference) > (process.env.VOLATILITY_ALERT_THRESHOLD || 1)) {
                            alerts.makeHighVolatilityAlert(
                                currency,
                                percentageDifference,
                                newest.usdRate,
                                newest.rubRate,
                                newest.amdRate,
                                newest.gelRate
                            );
                            previousSnapshotsWhichFiredAlert.set(currency, newest);
                        }
                    }
                })
            });
    });
}

function previousAlertIsTooOld(currentOldest, currency) {
    return currentOldest.date > memoryCache.previousSnapshotsWhichFiredAlert.get(currency);
}

function start() {
    // startDeleteOldSnapshotsJob();
    startFetchRatesJob();
    startAnalyzeVolatilityJob();
}

module.exports = {
    start
};