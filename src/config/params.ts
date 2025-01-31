export const CC_BOT_TOKEN = process.env.CC_BOT_TOKEN || "";

export const CC_MONGO_CONNECTION_STRING = process.env.CC_MONGO_CONNECTION_STRING || "mongodb://localhost:27017/node-ollama-agent-swarm?wtimeoutMS=15000";

export const CC_OLLAMA_HOST = process.env.CC_OLLAMA_HOST || "http://127.0.0.1:11434";
export const CC_OLLAMA_CHAT_MODEL = process.env.CC_OLLAMA_CHAT_MODEL || "nemotron-mini:4b";
export const CC_OLLAMA_EMBEDDER_MODEL = process.env.CC_OLLAMA_EMBEDDER_MODEL || "nomic-embed-text";

export const CC_CLIENT_SESSION_EXPIRE_SECONDS = 7 * 24 * 60 * 60; // 1 week

export const CC_REDIS_HOST = process.env.CC_REDIS_HOST || "127.0.0.1";
export const CC_REDIS_PORT = parseInt(process.env.CC_REDIS_PORT) || 6379;
export const CC_REDIS_PASSWORD = process.env.CC_REDIS_PASSWORD || "";

export const CC_VECTOR_SEARCH_LIMIT = parseInt(process.env.CC_VECTOR_SEARCH_LIMIT) || 5;
export const CC_VECTOR_SEARCH_SIMILARITY = parseFloat(process.env.CC_VECTOR_SEARCH_SIMILARITY) || 0.55;

export const CC_REDIS_FLUSHALL = !!process.env.CC_REDIS_FLUSHALL || false;

export const CC_WWWROOT_PORT = parseInt(process.env.CC_WWWROOT_PORT) || 80;
export const CC_WWWROOT_PATH = process.env.CC_WWWROOT_PATH || "./public";

export const CC_EXECUTE_TEST = !!process.env.CC_EXECUTE_TEST;

/**
 * @see https://github.com/ollama/ollama/blob/86a622cbdc69e9fd501764ff7565e977fc98f00a/server/model.go#L158
 */
export const CC_TOOL_PROTOCOL_PROMPT = process.env.CC_TOOL_PROTOCOL_PROMPT || `For each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:
<tool_call>
{"name": <function-name>, "arguments": <args-json-object>}
</tool_call>
`;
