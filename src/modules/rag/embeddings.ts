import { openai } from "../../lib/openai.js";

export const createEmbedding = async (text: string) => {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text
  });

  return res.data[0].embedding;
};
