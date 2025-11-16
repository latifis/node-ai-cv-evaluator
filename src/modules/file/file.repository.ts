import { prisma } from "../../config/db";

export const fileRepository = {
  create: (data: {
    filename: string;
    originalName: string;
    mimetype: string;
    path: string;
    size: number;
  }) => {
    return prisma.file.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        mimetype: data.mimetype,
        path: data.path,
        size: data.size
      }
    });
  },

  findById: (id: string) => {
    return prisma.file.findUnique({ where: { id } });
  }
};
