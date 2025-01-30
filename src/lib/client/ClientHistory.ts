import { IPubsubArray, obsolete, singleshot } from "functools-kit";
import BaseList from "../common/BaseList";
import { CC_CLIENT_SESSION_EXPIRE_SECONDS } from "src/config/params";
import { IModelMessage } from "agent-swarm-kit";
import { ioc } from "src/lib";

interface IClientHistoryParams {
  clientId: string;
  agentName: string;
}

export class ClientHistory implements IPubsubArray<IModelMessage> {
  readonly _items: IModelMessage[] = [];

  constructor(readonly params: IClientHistoryParams) {}

  getMessageList = singleshot(() => {
    class MessageList extends BaseList(
      `node-ollama-agent-swarm__clientHistoryChat__${this.params.clientId}`,
      {
        TTL_EXPIRE_SECONDS: CC_CLIENT_SESSION_EXPIRE_SECONDS,
      }
    ) {}
    return new MessageList();
  });

  public getFirst = obsolete(async () => {
    return await this.getMessageList().getFirst();
  }, "getFirst");

  public push = async (message: IModelMessage) => {
    ioc.loggerService.debug(
      `ClientHistory push agentName=${this.params.agentName} clientId=${this.params.clientId}`,
      {
        message,
      }
    );
    this._items.push(message);
    await this.getMessageList().push(message);
  };

  public shift = obsolete(async () => {
    return await this.getMessageList().shift();
  }, "shift");

  public length = obsolete(async () => {
    return await this.getMessageList().length();
  }, "length");

  public clear = () => Promise.resolve();

  async *[Symbol.asyncIterator](): AsyncIterableIterator<IModelMessage> {
    ioc.loggerService.debug(
      `ClientHistory iterate agentName=${this.params.agentName} clientId=${this.params.clientId}`,
      {
        items: this._items,
      }
    );
    for (const item of this._items) {
      yield item;
    }
  }
}

export default ClientHistory;
