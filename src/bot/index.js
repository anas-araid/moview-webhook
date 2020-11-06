require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
// LE LINEE DI CODICE COMMENTATE SERVONO QUANDO SI SPOSTA IL PROGETTO IN PRODUCTION
//var port = process.env.PORT || 443;
//var host = '0.0.0.0';
//var externalUrl = process.env.HEROKU_URL;
// { webHook: { port : port, host : host } }
// INIZIALIZZA IL BOT
const bot = new TelegramBot(token, {polling: true});
//bot.setWebHook(externalUrl + ':443/bot' + token);

// SI TRIGGERA QUANDO RICEVE IL COMANDO /start
bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  let opt = {parse_mode: 'html'};
  bot.sendMessage(chatId, "<i>You talkin’ to me?</i>", opt);
  bot.sendMessage(chatId, "Do you want a movie suggestion from specific actors, directors, genres, year, language? You can also provide keywords to further narrow down the research. \nFor example: <i>give me an action movie from the 80s with stallone</i>", opt);
  return;
});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg)
  // se è /start non deve fare niente
  if (msg.text === '/start'){
    return;
  }
  bot.sendMessage(chatId, 'Ciao mondo!');
});