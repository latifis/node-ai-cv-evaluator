import { prisma } from "../../config/db";

export const ragRepository = {
  saveChunk: (data: any) =>
    prisma.embeddingChunk.create({
      data
    })
};
