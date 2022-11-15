var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    currencyName: {
        type: String,
        required: true
    },
    usdRate: {
        type: String,
        required: true
    },
    rubRate: {
        type: String,
        required: true
    },
    amdRate: {
        type: String,
        required: true
    },
    gelRate: {
        type: String,
        required: true
    }
});
var Snapshot = mongoose.model('Snapshot', schema);

module.exports = {
    Snapshot
};