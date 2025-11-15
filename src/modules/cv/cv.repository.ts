import { prisma } from "../../config/db";

export const cvRepository = {
  save: (rawText: string, parsedJson: any) =>
    prisma.cV.create({
      data: {
        fileName: "uploaded.txt",
        rawText,
        parsedJson
      }
    })
};
