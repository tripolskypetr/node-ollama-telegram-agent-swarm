import { setBackend } from "@tensorflow/tfjs-core";
import { createLogger } from "pinolog";

import "@tensorflow/tfjs-backend-wasm";
import { setConfig, swarm } from "agent-swarm-kit";
import ClientHistory from "src/lib/client/ClientHistory";

setBackend("wasm");

setConfig({
  CC_GET_AGENT_HISTORY: (clientId, agentName) =>
    new ClientHistory({
      clientId,
      agentName,
    }),
});

{
  const logger = createLogger("agent-swarm-kit.log");
  swarm.loggerService.setLogger({
    log: (...args) => logger.log(...args),
    debug: (...args) => logger.info(...args),
  });
}

