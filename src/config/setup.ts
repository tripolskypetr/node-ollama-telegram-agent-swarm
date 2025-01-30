import { setBackend } from "@tensorflow/tfjs-core";

import "@tensorflow/tfjs-backend-wasm";
import { setConfig, swarm } from "agent-swarm-kit";
import ClientHistory from "src/lib/client/ClientHistory";
import { ioc } from "src/lib";

setBackend("wasm");

setConfig({
  CC_GET_AGENT_HISTORY: (clientId, agentName) =>
    new ClientHistory({
      clientId,
      agentName,
    }),
});

swarm.loggerService.setLogger({
  log: (...args) => ioc.loggerService.log(...args),
  debug: (...args) => ioc.loggerService.debug(...args),
});
