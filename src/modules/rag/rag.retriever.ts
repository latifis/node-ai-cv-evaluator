import { prisma } from "../../config/db";

export const retrieveSimilar = async (embedding: number[], k = 5) => {
  return prisma.$queryRawUnsafe(`
    SELECT * FROM "EmbeddingChunk"
    ORDER BY vector <-> '${JSON.stringify(embedding)}'
    LIMIT ${k}
  `);
};
