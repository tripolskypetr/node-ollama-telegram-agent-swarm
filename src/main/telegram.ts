import { CC_BOT_TOKEN, CC_EXECUTE_TEST } from "src/config/params";
import getContactData from "src/utils/getChatData";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const main = async () => {
  if (CC_EXECUTE_TEST) {
    return;
  }
  const bot = new Telegraf(CC_BOT_TOKEN);

  bot.on(message("text"), (ctx) => {
    const dto = getContactData(ctx);

    console.log(ctx.message.text);
  });

  await bot.launch();
};

main();
