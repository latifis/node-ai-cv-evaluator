import { openaiClient } from "../../lib/openai";

export const createEmbedding = async (text: string) => {
  const res = await openaiClient.embeddings.create({
    model: "text-embedding-3-large",
    input: text
  });

  return res.data[0].embedding;
};
