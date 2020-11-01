require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
var port = process.env.PORT || 443;
var host = '0.0.0.0';
var externalUrl = process.env.HEROKU_URL;
// {polling: true}
// { webHook: { port : port, host : host } }
const bot = new TelegramBot(token, {polling: true});
//bot.setWebHook(externalUrl + ':443/bot' + token);

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
  if (null){

  }
  bot.sendMessage(chatId, 'Cazzo vuoi che devi configurare Dialogflow');
});