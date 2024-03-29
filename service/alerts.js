const telegram = require("./telegram");
const {formatNumber} = require("../util");
const {bot, handleMessageError} = require("../telegramBot");

function makeHighVolatilityAlert(diff, usdRate, rubRate, amdRate, gelRate) {
    if (bot) {
        telegram.getTelegramChats()
            .then(chats => {
                chats.forEach(function (chat) {
                    bot.sendMessage(
                        chat.id,
                        formatNumber(diff) + '%'
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

module.exports = {
    makeHighVolatilityAlert
}