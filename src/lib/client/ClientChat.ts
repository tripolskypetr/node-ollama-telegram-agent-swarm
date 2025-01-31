import { makeAutoDispose, makeConnection } from "agent-swarm-kit";
import { randomString, singleshot, Subject } from "functools-kit";
import { ROOT_SWARM } from "src/logic";
import getChatData, { TChatData } from "src/utils/getChatData";

import { Context, Telegraf } from "telegraf";

export class ClientChat {
  readonly _chatData = getChatData(this.context);
  readonly _sendMessageSubject = new Subject<string>();

  constructor(readonly bot: Telegraf, readonly context: Context) {}

  public beginChat = singleshot((onDispose: (context: Context) => void) => {
    const clientId = randomString();
    this.bot.telegram.sendMessage(
      this._chatData.chat_id,
      `Starting bot session ${clientId}`
    );
    const send = makeConnection(
      ({ agentName, data }) => {
        this.bot.telegram.sendMessage(
          this._chatData.chat_id,
          `${agentName}: ${data}`
        );
      },
      clientId,
      ROOT_SWARM
    );
    const { tick } = makeAutoDispose(clientId, ROOT_SWARM, {
      onDestroy: () => {
        this._sendMessageSubject.unsubscribeAll();
        onDispose(this.context);
      },
    });
    this._sendMessageSubject.subscribe(send);
    this._sendMessageSubject.subscribe(tick);
    return this;
  });

  public sendMessage = async (message: string) => {
    await this._sendMessageSubject.next(message);
  };
}

export default ClientChat;
