import { addAgent } from "agent-swarm-kit";
import { str } from "functools-kit";
import { CC_TOOL_PROTOCOL_PROMPT } from "src/config/params";
import { OLLAMA_COMPLETION } from "../completion/ollama.completion";
import { NAVIGATE_TO_REFUND } from "../tools/navigate/navigate_to_refund.tool";
import { NAVIGATE_TO_SALES } from "../tools/navigate/navigate_to_sales.tool";
import { NAVIGATE_TO_TRIAGE } from "../tools/navigate/navigate_to_triage.tool";

const AGENT_PROMPT = `You are to triage a users request, and call a tool to transfer to the right agent.
To transfer use a right tool from a list. Use the chat history instead of asking a direct question
Do not tell the user the details of your functionality
Act like a real person
Navigate to the agent without asking additional details
If the speech is about agent, navigate immediately
If you can't be sure which agent you should navigate to, ask the direct question
If you can't understand if user want to buy or return, navigate to the sales agent
`;

export const TRIAGE_AGENT = addAgent({
  agentName: "triage_agent",
  prompt: str.newline(AGENT_PROMPT, CC_TOOL_PROTOCOL_PROMPT),
  completion: OLLAMA_COMPLETION,
  tools: [NAVIGATE_TO_REFUND, NAVIGATE_TO_SALES, NAVIGATE_TO_TRIAGE],
});
