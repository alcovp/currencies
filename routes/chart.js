var express = require('express');
const snapshots = require("../service/snapshots");
var router = express.Router();

router.get('/', function (req, res, next) {
    snapshots.getSnapshotsInLast24Hours()
        .then(data => res.render('chart', {data}))
        .catch(err => res.render('chart', {err}));
});

module.exports = router;
