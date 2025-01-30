import { addCompletion } from "agent-swarm-kit";
import { ioc } from "src/lib";
import ContextService from "src/lib/services/base/ContextService";

export const OLLAMA_COMPLETION = addCompletion({
  completionName: "ollama_completion",
  getCompletion: async (params) => {
    return await ContextService.runInContext(
      async () => {
        return await ioc.completionService.getCompletion(params);
      },
      {
        clientId: params.clientId,
      }
    );
  },
});
