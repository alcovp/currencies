var express = require('express');
const snapshots = require("../service/snapshots");
var router = express.Router();

router.get('/', function (req, res, next) {
    snapshots.getSnapshotsInLast24Hours()
        .then(data => res.json(data))
        .catch(err => res.json(err));
});

module.exports = router;
