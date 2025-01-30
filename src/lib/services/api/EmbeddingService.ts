import { singleshot } from "functools-kit";
import { inject } from "src/lib/core/di";
import { tidy, mul, norm, sum, tensor1d, div } from "@tensorflow/tfjs-core";
import LoggerService from "../base/LoggerService";
import TYPES from "src/lib/core/types";
import { CC_OLLAMA_EMBEDDER_MODEL, CC_OLLAMA_HOST } from "src/config/params";
import { Ollama } from "ollama";

const getOllamaEmbedder = singleshot(() => new Ollama({ host: CC_OLLAMA_HOST }));

type Embeddings = number[];

export class EmbeddingService {
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  public createEmbedding = async (text: string): Promise<Embeddings> => {
    this.loggerService.logCtx("embeddingService createEmbedding", {
      text,
    });
    const embedder = await getOllamaEmbedder();
    const { embedding } = await embedder.embeddings({
      model: CC_OLLAMA_EMBEDDER_MODEL,
      prompt: text,
    });
    return embedding;
  };

  public calculateEmbeddings = async (a: Embeddings, b: Embeddings) => {
    this.loggerService.logCtx("embeddingService calculateEmbeddings");
    return tidy(() => {
      const tensorA = tensor1d(a);
      const tensorB = tensor1d(b);
      const dotProduct = sum(mul(tensorA, tensorB));
      const normA = norm(tensorA);
      const normB = norm(tensorB);
      const cosineData = div(dotProduct, mul(normA, normB)).dataSync();
      const cosineSimilarity = cosineData[0];
      this.loggerService.logCtx("embeddingService calculateEmbeddings result", { cosineSimilarity });
      return cosineSimilarity;
    });
  };

  public compareStrings = async (t1: string, t2: string) => {
    this.loggerService.logCtx("embeddingService compareStrings", {
      t1,
      t2,
    });
    const [e1, e2] = await Promise.all([
      this.createEmbedding(t1),
      this.createEmbedding(t2),
    ]);
    return await this.calculateEmbeddings(
      e1,
      e2,
    );
  }
}

export default EmbeddingService;
