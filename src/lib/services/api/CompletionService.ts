import { singleshot } from "functools-kit";
import { Ollama } from "ollama";
import { ICompletionArgs, IModelMessage } from "agent-swarm-kit";
import { CC_OLLAMA_HOST, CC_OLLAMA_CHAT_MODEL } from "src/config/params";
import { inject } from "src/lib/core/di";
import LoggerService from "../base/LoggerService";
import TYPES from "src/lib/core/types";
import { omit } from "lodash-es";

const getOllama = singleshot(() => new Ollama({ host: CC_OLLAMA_HOST }));

export class CompletionService {
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  public getCompletion = async ({
    agentName,
    messages,
    mode,
    tools,
  }: ICompletionArgs): Promise<IModelMessage> => {
    this.loggerService.logCtx(`completionService getCompletion`, {
      messages,
      tools,
    });
    const response = await getOllama().chat({
      model: CC_OLLAMA_CHAT_MODEL,
      keep_alive: "1h",
      messages: messages.map((message) => omit(message, "agentName", "mode")),
      tools,
    });
    return {
      ...response.message,
      mode,
      agentName,
      role: response.message.role as IModelMessage["role"],
    };
  };
}

export default CompletionService;
