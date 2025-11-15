import { Request, Response } from "express";
import { projectService } from "./project.service";

export const parseProjectController = async (req: Request, res: Response) => {
  const { text } = req.body;

  const result = await projectService.parseAndSave(text);

  res.json({
    success: true,
    data: result
  });
};
