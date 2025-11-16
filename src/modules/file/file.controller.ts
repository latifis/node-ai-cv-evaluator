import { Request, Response } from "express";
import { fileService } from "./file.service";

export const uploadController = async (req: Request, res: Response) => {
  try {
    const cvFile = (req.files as any)?.cv?.[0];
    const reportFile = (req.files as any)?.report?.[0];

    if (!cvFile && !reportFile) {
      return res.status(400).json({ message: "No files uploaded (expect cv and/or report)" });
    }

    const results: any = {};

    if (cvFile) {
      results.cv = await fileService.saveFileMeta(cvFile);
    }
    if (reportFile) {
      results.report = await fileService.saveFileMeta(reportFile);
    }

    return res.json({
      success: true,
      data: results
    });
  } catch (err: any) {
    console.error("uploadController error:", err);
    return res.status(500).json({ success: false, message: err.message || "upload failed" });
  }
};
