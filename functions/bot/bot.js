const Telegraf = require('telegraf');
const orderAction = require('./actions/order');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command('order', (ctx) => {
  return orderAction(ctx);
});

exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: 'This endpoint is meant for bot and telegram communication',
    };
  }
};
