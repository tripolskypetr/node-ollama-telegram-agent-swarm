import { Context } from "telegraf";
import { Chat } from "telegraf/types";

export const getContactData = (ctx: Context) => {
    const chat = ctx.message.chat as Chat.PrivateChat;
    return {
        chat_id: ctx.message.chat.id,
        telegram: chat.username,
        first_name: chat.first_name,
        last_name: chat.last_name,
    };
};

export default getContactData;
