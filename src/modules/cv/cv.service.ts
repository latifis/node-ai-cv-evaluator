import { parseCv } from "./parseCv";
import { cvRepository } from "./cv.repository";

export const cvService = {
  parseAndSave: async (rawText: string) => {
    const parsed = await parseCv(rawText);
    return cvRepository.save(rawText, parsed);
  }
};
