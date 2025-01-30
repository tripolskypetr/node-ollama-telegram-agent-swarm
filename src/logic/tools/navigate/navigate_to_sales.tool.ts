import { addTool, changeAgent, execute } from "agent-swarm-kit";
import { sleep } from "functools-kit";
import { SALES_AGENT } from "src/logic/agent/sales.agent";
import { z } from "zod";

const PARAMETER_SCHEMA = z.object({}).strict();

export const NAVIGATE_TO_SALES = addTool({
  toolName: "navigate_to_sales_tool",
  validate: async (clientId, agentName, params) => {
    const { success } = await PARAMETER_SCHEMA.spa(params);
    return success;
  },
  call: async (clientId) => {
    await changeAgent(SALES_AGENT, clientId);
    await execute("Say hello to the user", clientId, SALES_AGENT);
  },
  type: "function",
  function: {
    name: "navigate_to_sales_tool",
    description: "Navigate to sales agent",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
});
