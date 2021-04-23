var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique : true
    },
    username: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false
    }
});
var TelegramChat = mongoose.model('TelegramChat', schema);

module.exports = {
    TelegramChat
};