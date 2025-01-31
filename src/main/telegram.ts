import { memoize } from "functools-kit";
import { CC_BOT_TOKEN, CC_EXECUTE_TEST } from "src/config/params";
import ClientChat from "src/lib/client/ClientChat";
import { Context, Telegraf } from "telegraf";
import { message } from "telegraf/filters";

const getChatInstance = memoize(
  ([, context]) => context.message.chat.id,
  (bot: Telegraf, context: Context) => {
    return new ClientChat(bot, context).beginChat(() => {
      getChatInstance.clear(context.message.chat.id);
    });
  }
);

const main = async () => {
  if (CC_EXECUTE_TEST) {
    return;
  }
  if (!CC_BOT_TOKEN) {
    return;
  }
  const bot = new Telegraf(CC_BOT_TOKEN);

  bot.on(message("text"), async (ctx) => {
    const chatInstance = getChatInstance(bot, ctx);
    await chatInstance.sendMessage(ctx.message.text);
  });

  await bot.launch();
};

main();
