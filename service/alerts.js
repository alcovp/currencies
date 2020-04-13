const telegram = require("./telegram");
const {formatNumber} = require("../util");
const {bot} = require("../telegramBot");

function makeHighVolatilityAlert(diff, price) {
    if (bot) {
        telegram.getTelegramChats()
            .then(chats => {
                chats.forEach(function (chat) {
                    bot.sendMessage(
                        chat.id,
                        `HIGH VOLATILITY ALERT!\nDifference is ${formatNumber(diff)}%\nPrice is ${formatNumber(price)} USD`
                    )
                        .then()
                        .catch(err => console.error(err));
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