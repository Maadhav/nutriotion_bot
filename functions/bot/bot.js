const Telegraf = require("telegraf");
const itemAction = require("./actions/getItemDetails");
const axios = require("axios").default;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command("/item", (ctx) => {
  return itemAction(ctx);
});

bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
  const apiUrl = `http://recipepuppy.com/api/?q=${inlineQuery.query}`;
  const response = await fetch(apiUrl);
  const { results } = await response.json();
  const recipes = results
    .filter(({ thumbnail }) => thumbnail)
    .map(({ title, href, thumbnail }) => ({
      type: "article",
      id: thumbnail,
      title: title,
      description: title,
      thumb_url: thumbnail,
      input_message_content: {
        message_text: title
      },
      reply_markup: Markup.inlineKeyboard([
        Markup.urlButton("Go to recipe", href)
      ])
    }));
  return answerInlineQuery(recipes);
});

bot.on("chosen_inline_result", ({ chosenInlineResult }) => {
  console.log("chosen inline result", chosenInlineResult);
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
// getSearchResults({query: "milk"})
// async function getSearchResults({ query }) {
//   axios
//     .post("https://www.mynetdiary.com/muiInstantFoodSearchFindFoods.do", {
//       searchToken: query
//     })
//     .then(function (response) {
//       console.log(response.data.entries);
//     });
// }

// async function getNutrientDetails({ url }) {
//   return await axios
//     .get("https://www.mynetdiary.com/" + url)
//     .then(function (response) {
//       const regex = new RegExp("(?<=injectedFoodLabel = ).*?(?=;)", "s");
//       const str = response.data.toString();
//       var arr = regex.exec(str);
//       let data = JSON.parse(arr[0]);
//       return data;
//     });
// }
