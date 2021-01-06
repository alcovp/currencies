const TelegramBot = require('node-telegram-bot-api');
const snapshots = require("./service/snapshots");
const telegram = require("./service/telegram");
const rates = require("./service/rates");

const token = process.env.TELEGRAM_BOT_TOKEN || undefined;
const superUserId = process.env.SUPER_USER_TELEGRAM_CHAT_ID || undefined;
let bot;
if (token) {
    bot = new TelegramBot(token, {polling: true});

// bot.on("polling_error", (err) => console.log(err));

    bot.onText(/\/price/, (msg, match) => {
        const chatId = msg.chat.id;
        snapshots.getNewestSnapshot()
            .then(snapshot => {
                bot.sendMessage(chatId, snapshot.usdRate);
            })
            .catch(err => console.error(err));
    });

    bot.onText(/\/summary/, (msg, match) => {
        const chatId = msg.chat.id;
        if (superUserId && superUserId === chatId) {
            rates.getSummary(function (err, data) {
                if (data) {
                    bot.sendMessage(chatId, data);
                } else {
                    console.error(err);
                }
            });
        } else {
            bot.sendMessage(chatId, "not authorized");
        }
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const username = msg.chat.username;
        telegram.saveTelegramChat(chatId, username)
            .then()
            .catch(err => console.error(err));
    });
}

module.exports = {
    bot
}