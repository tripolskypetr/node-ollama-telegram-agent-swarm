import { addAgent } from "agent-swarm-kit";
import { OLLAMA_COMPLETION } from "../completion/ollama.completion";
import { str } from "functools-kit";
import { CC_TOOL_PROTOCOL_PROMPT } from "src/config/params";
import { NAVIGATE_TO_TRIAGE } from "../tools/navigate/navigate_to_triage.tool";
import { SEARCH_PHARMA_PRODUCT } from "../tools/product/search_pharma_product.tool";

const AGENT_PROMPT = `You are a sales agent that handles all actions related to placing the order to purchase an item.
If user do not want to buy navigate him back to triage agent
Tell the users all details about products in the database by using necessary tool calls
Do not send any JSON to the user. Format it as plain text. Do not share any internal details like ids, format text human readable
If the previous user messages contains product request, tell him details immidiately
`;

export const SALES_AGENT = addAgent({
  agentName: "sales_agent",
  completion: OLLAMA_COMPLETION,
  prompt: str.newline(AGENT_PROMPT, CC_TOOL_PROTOCOL_PROMPT),
  tools: [NAVIGATE_TO_TRIAGE, SEARCH_PHARMA_PRODUCT],
});
