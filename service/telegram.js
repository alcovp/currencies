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

module.exports = {
    saveTelegramChat,
    getTelegramChats
}