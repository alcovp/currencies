const {TelegramChat} = require("../models/telegramChat");

function saveTelegramChat(id, username) {
    return TelegramChat.findOneAndUpdate(
        {id: id},
        {username: username},
        {upsert: true}
    );
}

function deleteTelegramChat(id) {
    return TelegramChat.findOneAndDelete(
        {id: id},
        function (error, doc) {
            if (error) {
                console.error(error);
            } else {
                console.log('deleted ' + id);
            }
        }
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
    deleteTelegramChat,
    getTelegramChats,
    updateBalance,
    getTelegramChat
}