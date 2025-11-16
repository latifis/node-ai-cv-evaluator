import { Request, Response } from "express";
import { fileService } from "./file.service";

export const uploadController = async (req: Request, res: Response) => {
  try {
    const cvFile = (req.files as any)?.cv?.[0];
    const reportFile = (req.files as any)?.report?.[0];

    if (!cvFile && !reportFile) {
      return res.status(400).json({ 
        success: false, 
        message: "No files uploaded (expect cv and/or report)" 
      });
    }

    const results: Record<string, any> = {};

    if (cvFile) {
      results.cv = await fileService.saveFileMeta(cvFile);
    }
    if (reportFile) {
      results.report = await fileService.saveFileMeta(reportFile);
    }

    return res.status(201).json({
      success: true,
      data: {
        ...(results.cv && { cv_id: results.cv.id }),
        ...(results.report && { report_id: results.report.id })
      }
    });
  } catch (err: any) {
    console.error("uploadController error:", err);
    return res.status(500).json({ 
      success: false, 
      message: err.message || "Upload failed" 
    });
  }
};
