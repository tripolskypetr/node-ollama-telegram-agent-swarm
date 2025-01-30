import { loadModel } from "gpt4all";

await loadModel("nomic-embed-text-v1.5.f16.gguf", { verbose: true, type: 'embedding'});
