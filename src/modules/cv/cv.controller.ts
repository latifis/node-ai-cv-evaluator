import { Request, Response } from "express";
import { cvService } from "./cv.service"

export const parseCvController = async (req: Request, res: Response) => {
  const { text } = req.body;

  const result = await cvService.parseAndSave(text);

  res.json({
    success: true,
    data: result
  });
};
