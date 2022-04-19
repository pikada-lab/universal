const ICQ = require("icq-bot").default;
const TOKEN = "001.0232927109.1999608478:751212693"
const bot = new ICQ.Bot(TOKEN);

let handler = new ICQ.Handler.Message(null, (bot, event) => {
  console.log(event, bot);
 });
bot.getDispatcher().addHandler(handler);
bot.startPolling(); 