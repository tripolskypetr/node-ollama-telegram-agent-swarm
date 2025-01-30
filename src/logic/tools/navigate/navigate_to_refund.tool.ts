import { addTool, changeAgent, execute } from "agent-swarm-kit";
import { REFUND_AGENT } from "src/logic/agent/refund.agent";
import { z } from "zod";

const PARAMETER_SCHEMA = z.object({}).strict();

export const NAVIGATE_TO_REFUND = addTool({
  toolName: "navigate_to_refund_tool",
  validate: async (clientId, agentName, params) => {
    const { success } = await PARAMETER_SCHEMA.spa(params);
    return success;
  },
  call: async (clientId) => {
    await changeAgent(REFUND_AGENT, clientId);
    await execute(
      "Say hello to the user",
      clientId,
      REFUND_AGENT,
    );
  },
  type: "function",
  function: {
    name: "navigate_to_refund_tool",
    description: "Navigate to refund agent",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
});
