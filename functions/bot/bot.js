const Telegraf = require("telegraf");
const itemAction = require("./actions/getItemDetails");
const axios = require("axios").default;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("/item", (ctx) => {
  return itemAction(ctx);
});

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const items = await getSearchResults(inlineQuery.query);
  console.log(`inline_query received ${inlineQuery.query}`);
  const results = items.map((item) => ({
    type: "article",
    id: item.beanId,
    title: item.descForUi.replace(/<\/?[^>]+(>|$)/g, ""),
    thumb_url: item.imageSrc,
    input_message_content: {
      message_text: item.descForUi,
      parse_mode: "HTML"
    },
    reply_markup: {
      inline_keyboard: [[{ text: "More info", callback_data: "moreinfo" }]]
    },
    hide_url: false,
    url: "https://www.mynetdiary.com/" + item.openCatalogUrl
  }));
  return answerInlineQuery(results);
});

bot.on("chosen_inline_result", ({ chosenInlineResult, from }) => {
  console.log("chosen inline result ", chosenInlineResult);
  bot.telegram.sendMessage(
    from.id,
    `chosen inline result ${chosenInlineResult}`
  );
});

exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: "This endpoint is meant for bot and telegram communication"
    };
  }
};
async function getSearchResults(query) {
  let response = await axios.post(
    "https://www.mynetdiary.com/muiInstantFoodSearchFindFoods.do",
    {
      searchToken: query
    }
  );

  return response.data.entries;
}

async function getNutrientDetails({ foodId }) {
  return await axios
    .get(
      `https://www.mynetdiary.com/muiGetInstantFoodSearchFood.do?foodId=${foodId}`
    )
    .then(function (response) {
      return response.data;
    });
}
