const telegram = require("./telegram");
const {formatNumber} = require("../util");
const {bot, handleMessageError} = require("../telegramBot");

function makeHighVolatilityAlert(currency, diff, usdRate, rubRate, amdRate, gelRate) {
    if (bot) {
        telegram.getTelegramChats()
            .then(chats => {
                chats.forEach(function (chat) {
                    bot.sendMessage(
                        chat.id,
                        getDiffSign(diff) + currency
                        + '\n' + formatNumber(diff) + '%'
                        + '\n$' + formatNumber(usdRate)
                        + '\n₽' + formatNumber(rubRate)
                        // + '\nԴ' + formatNumber(amdRate)
                        // + '\n₾' + formatNumber(gelRate)
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

function getDiffSign(diff) {
    const threshold = process.env.VOLATILITY_ALERT_THRESHOLD
    if (diff > threshold + 1) {
        return '⏫'
    }
    if (diff < threshold - 1) {
        return '⏬'
    }
    return diff > 0 ? '🔼' : '🔽'
}

module.exports = {
    makeHighVolatilityAlert
}