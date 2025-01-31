import { addAgent } from "agent-swarm-kit";
import { OLLAMA_COMPLETION } from "../completion/ollama.completion";
import { str } from "functools-kit";
import { CC_TOOL_PROTOCOL_PROMPT } from "src/config/params";
import { SEARCH_PHARMA_PRODUCT } from "../tools/product/search_pharma_product.tool";

const AGENT_PROMPT = `You are a refund agent that handles all actions related to placing the refund an pharma product.
Tell the users all details about products in the database by using necessary tool calls
Do not send any JSON to the user. Format it as plain text. Do not share any internal details like ids, format text human readable
If the previous user messages contains product request, tell him details immidiately
`;

const MODEL_TWEAK_PROMPT = str.newline(
  "Do not call the function which does not exist",
  "List of functions: search_pharma_product",
  "",
  "It is important not to call tools recursive. Execute the search once",
);

export const REFUND_AGENT = addAgent({
  agentName: "refund_agent",
  completion: OLLAMA_COMPLETION,
  system: [CC_TOOL_PROTOCOL_PROMPT, MODEL_TWEAK_PROMPT],
  prompt: str.newline(AGENT_PROMPT),
  tools: [SEARCH_PHARMA_PRODUCT],
});
