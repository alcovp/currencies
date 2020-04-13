const rates = require("./service/rates");
const snapshots = require("./service/snapshots");
const schedule = require('node-schedule');
const alerts = require("./service/alerts");

let previousSnapshotWhichFiredAlert;

function startFetchRatesJob() {
    const job = schedule.scheduleJob('0 */10 * ? * *', function (fireDate) {
        rates.getRates('BTC', function (err, data) {
            if (err) {
                console.error(err);
            } else {
                snapshots.saveSnapshot(data);
            }
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
    const job = schedule.scheduleJob('0 */10 * ? * *', function (fireDate) {
    // const job = schedule.scheduleJob('*/5 * * ? * *', function (fireDate) {
        snapshots.getSnapshotsInLast24Hours()
            .then(snapshots => {
                if (snapshots && snapshots.length > 1) {
                    let oldest = snapshots[0].usdRate;
                    if (previousSnapshotWhichFiredAlert && !previousAlertIsTooOld(oldest)) {
                        oldest = previousSnapshotWhichFiredAlert;
                    }
                    const newest = snapshots[snapshots.length - 1].usdRate;
                    const percentageDifference = Math.abs(1 - oldest / newest) * 100;
                    if (percentageDifference > 1) {
                        alerts.makeHighVolatilityAlert(percentageDifference, newest);
                        previousSnapshotWhichFiredAlert = newest;
                    }
                }
            });
    });
}

function previousAlertIsTooOld(currentOldest) {
    return currentOldest.date > previousSnapshotWhichFiredAlert;
}

function start() {
    startDeleteOldSnapshotsJob();
    startFetchRatesJob();
    startAnalyzeVolatilityJob();
}

module.exports = {
    start
};