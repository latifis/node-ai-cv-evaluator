import { fileRepository } from "./file.repository";

export const fileService = {
  saveFileMeta: async (file: Express.Multer.File) => {
    if (!file) throw new Error("No file provided");

    const saved = await fileRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
      createdAt: new Date()
    });

    return saved;
  },

  getFile: async (id: string) => {
    if (!id) throw new Error("File ID is required");
    const file = await fileRepository.findById(id);
    if (!file) throw new Error("File not found");
    return file;
  }
}
