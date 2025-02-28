const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const token = '8070086700:AAF-aqPY_6MOqgeBLv5lrB_B75TzeWYkGVM'; // Токен от @BotFather
const bot = new TelegramBot(token, { polling: true });
const adminId = '857785777'; // Замени на свой Telegram ID
let players = {};

if (fs.existsSync('players.json')) {
    players = JSON.parse(fs.readFileSync('players.json'));
}

// Обработка данных от Web App
bot.on('message', (msg) => {
    if (msg.web_app_data) {
        const data = JSON.parse(msg.web_app_data.data);
        players[data.playerName] = {
            score: data.score,
            clicks: data.clicks,
            level: data.level
        };
        fs.writeFileSync('players.json', JSON.stringify(players));
    }
});

// Команда /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Жми "Играть" и погнали!', {
        reply_markup: {
            keyboard: [[{ text: 'Играть', web_app: { url: 'https://twqstty.github.io/HAMSTERR/' } }]],
            resize_keyboard: true
        }
    });
});

// Команда /stats для админа
bot.onText(/\/stats/, (msg) => {
    if (msg.from.id.toString() === adminId) {
        let reply = 'Статистика игроков:\n';
        for (const [name, stats] of Object.entries(players)) {
            reply += `${name}: ${stats.score} очков, ${stats.clicks} кликов, ур. ${stats.level}\n`;
        }
        bot.sendMessage(adminId, reply || 'Пока никто не играл');
    } else {
        bot.sendMessage(msg.chat.id, 'Ты не админ!');
    }
});

console.log('Бот запущен!');