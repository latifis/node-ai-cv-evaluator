import fs from "fs-extra";
const pdf = require("pdf-parse");

export const extractTextFromPdf = async (filePath: string) => {
  const data = await fs.readFile(filePath);

  const parsed = await pdf(data);

  return parsed.text;
};
