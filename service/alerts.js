const telegram = require("./telegram");
const {formatNumber} = require("../util");
const {bot} = require("../telegramBot");

function makeHighVolatilityAlert(diff, usdRate, rubRate, amdRate, gelRate) {
    if (bot) {
        telegram.getTelegramChats()
            .then(chats => {
                chats.forEach(function (chat) {
                    bot.sendMessage(
                        chat.id,
                        formatNumber(diff)
                        + '\n$' + formatNumber(usdRate)
                        + '\n₽' + formatNumber(rubRate)
                        + '\nԴ' + formatNumber(amdRate)
                        + '\n₾' + formatNumber(gelRate)
                    )
                        .then()
                        .catch(err => handleMessageError(err, chat.id));
                });
            })
            .catch(err => console.error(err));
    } else {
        console.error('telegram bot is undefined');
    }
}

function handleMessageError(err, chatId) {
    console.error(err);
    if (err.response.body.error_code === 403) {
        console.error('We have received 403, so we are deleting user with chat id: ' + chatId);
        telegram.deleteTelegramChat(chatId);
    }
}

module.exports = {
    makeHighVolatilityAlert
}