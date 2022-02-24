// const Telegraf = require('telegraf');
// const itemAction = require('./actions/getItemDetails');
const axios = require("axios").default;

// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// bot.command('/item', (ctx) => {
//   return itemAction(ctx);
// });

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
  const offset = parseInt(inlineQuery.offset) || 0
  items = []
  for(var i = 0; i < 10; i++) {
    items.push({ title: 'Item '+i, desc: 'item '+i+' desc', id: '0000'+i, moreinfo: 'More info about item'+i+', mucho importante information'})
  }
  results = items.slice(offset, offset+10).map((item) => ({
    type: "article",
    id: item.id,
    title: item.title,
    description: item.desc,
    input_message_content: {
      message_text: '*'+item.title+'*\n'+item.desc,
      parse_mode: 'Markdown'
    },
    reply_markup: {
        inline_keyboard: [
          [{ text: 'More info', callback_data: 'moreinfo' }]
    ]},
    hide_url: true,
    url: 'http://www.domain.se/'+item.id,
  }))
  return answerInlineQuery(results, {is_personal: true, next_offset: offset+results.length, cache_time: 10})
})


bot.on('chosen_inline_result', ctx => {
  console.log(ctx.message)
  return ctx.reply('You chosed an inline query result')
})

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
getSearchResults({query: "milk"})
async function getSearchResults({ query }) {
  axios
    .post("https://www.mynetdiary.com/muiInstantFoodSearchFindFoods.do", {
      searchToken: query
    })
    .then(function (response) {
      console.log(response.data.entries);
    });
}

async function getNutrientDetails({ url }) {
  return await axios
    .get("https://www.mynetdiary.com/" + url)
    .then(function (response) {
      const regex = new RegExp("(?<=injectedFoodLabel = ).*?(?=;)", "s");
      const str = response.data.toString();
      var arr = regex.exec(str);
      let data = JSON.parse(arr[0]);
      return data;
    });
}
