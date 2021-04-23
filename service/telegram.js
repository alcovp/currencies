const {TelegramChat} = require("../models/telegramChat");

function saveTelegramChat(id, username) {
    return TelegramChat.findOneAndUpdate(
        {id: id},
        {username: username},
        {upsert: true}
    );
}

function getTelegramChats() {
    return TelegramChat
        .find({})
        .select('-_id id username')
        .exec();
}

function updateBalance(id, balance) {
    return TelegramChat.findOneAndUpdate(
        {id: id},
        {balance: balance}
    );
}

function getTelegramChat(id) {
    return TelegramChat
        .findOne({id: id})
        .select('-_id balance')
        .exec();
}

module.exports = {
    saveTelegramChat,
    getTelegramChats,
    updateBalance,
    getTelegramChat
}