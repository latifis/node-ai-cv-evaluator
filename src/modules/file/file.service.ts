import { fileRepository } from "./file.repository";

export const fileService = {
  saveFileMeta: async (file: Express.Multer.File) => {
    const saved = await fileRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size
    });
    return saved;
  },

  getFile: async (id: string) => {
    return fileRepository.findById(id);
  }
};
