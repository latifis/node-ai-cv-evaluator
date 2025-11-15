import { createEmbedding } from "./embeddings";
import { ragRepository } from "./rag.repository";

export const ingest = async (text: string, source: string) => {
  const emb = await createEmbedding(text);

  return ragRepository.saveChunk({
    chunk: text,
    vector: emb,
    source
  });
};
