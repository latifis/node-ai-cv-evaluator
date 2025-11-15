import { prisma } from "../../config/db";

export const projectRepository = {
  save: (data: any) =>
    prisma.project.create({
      data
    })
};