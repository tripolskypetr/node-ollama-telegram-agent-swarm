import { addTool, changeAgent, commitToolOutput, execute } from "agent-swarm-kit";
import { TRIAGE_AGENT } from "src/logic/agent/triage.agent";
import { z } from "zod";

const PARAMETER_SCHEMA = z.object({}).strict();

export const NAVIGATE_TO_TRIAGE = addTool({
  toolName: "navigate_to_triage_tool",
  validate: async (clientId, agentName, params) => {
    const { success } = await PARAMETER_SCHEMA.spa(params);
    return success;
  },
  call: async (toolId, clientId, agentName) => {
    await commitToolOutput(toolId, "Navigation success", clientId, agentName);
    await changeAgent(TRIAGE_AGENT, clientId);
    await execute("Say hello to the user", clientId, TRIAGE_AGENT);
  },
  type: "function",
  function: {
    name: "navigate_to_triage_tool",
    description: "Navigate to triage agent",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
});
