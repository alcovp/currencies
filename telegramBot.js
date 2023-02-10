const TelegramBot = require('node-telegram-bot-api');
const snapshots = require("./service/snapshots");
const telegram = require("./service/telegram");
const rates = require("./service/rates");
const {formatNumber} = require("./util");

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
                bot.sendMessage(
                    chatId,
                    '$' + formatNumber(snapshot.usdRate)
                    + '\n₽' + formatNumber(snapshot.rubRate)
                    + '\nԴ' + formatNumber(snapshot.amdRate)
                    + '\n₾' + formatNumber(snapshot.gelRate)
                );
            })
            .catch(err => console.error(err));
    });

    bot.onText(/^\/setbalance (\d+\.?\d*)$/, (msg, match) => {
        const chatId = msg.chat.id;
        const balance = match[1];
        telegram.updateBalance(chatId, balance)
            .then()
            .catch(err => console.error(err));
    });

    bot.onText(/\/getbalance/, (msg, match) => {
        const chatId = msg.chat.id;
        telegram.getTelegramChat(chatId)
            .then(chat => {
                rates.getBalance(chat.balance, function (err, data) {
                    if (data) {
                        bot.sendMessage(chatId, data);
                    } else {
                        console.error(err);
                    }
                });
            })
            .catch(err => console.error(err));
    });

    bot.onText(/\/summary/, (msg, match) => {
        const chatId = msg.chat.id;
        if (superUserId && Number(superUserId) === chatId) {
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

    bot.onText(/\/announcement (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const announcement = match[1];
        if (superUserId && Number(superUserId) === chatId) {
            try {
                makeAnnouncement(announcement);
            } catch (e) {
                console.error(e);
            }
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

function makeAdminAlert(message) {
    if (bot && superUserId) {
        bot.sendMessage(superUserId, message)
            .then()
            .catch(console.error);
    } else {
        console.error('telegram bot is undefined');
    }
}

function makeAnnouncement(message) {
    if (bot) {
        telegram.getTelegramChats()
            .then(chats => {
                chats.forEach(function (chat) {
                    bot.sendMessage(chat.id, message)
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
    if (err.response.body.error_code === 403 || err.response.body.error_code === 400) {
        const message = 'We have received 403 or 400, so we are deleting user with chat id: ' + chatId;
        console.error(message);
        makeAdminAlert(message);
        telegram.deleteTelegramChat(chatId);
    }
}

module.exports = {
    bot,
    handleMessageError
}