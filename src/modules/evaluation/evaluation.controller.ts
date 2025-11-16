import { Request, Response } from "express";
import { evaluationService } from "./evaluation.service";

export const enqueueController = async (req: Request, res: Response) => {
  try {
    const { jobTitle, cvId, reportId } = req.body;
    if (!jobTitle || !cvId || !reportId) {
      return res.status(400).json({ message: "jobTitle, cvId and reportId required" });
    }

    const job = await evaluationService.enqueueJob(jobTitle, cvId, reportId);
    return res.json({ id: job.id, status: job.status });
  } catch (err: any) {
    console.error("enqueueController", err);
    return res.status(500).json({ message: err.message || "internal error" });
  }
};

export const getResultController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const job = await evaluationService.getJob(id);
    if (!job) return res.status(404).json({ message: "job not found" });

    if (job.status !== "completed") {
      return res.json({ id: job.id, status: job.status });
    }

    return res.json({
      id: job.id,
      status: job.status,
      result: {
        cv_match_rate: job.cvMatchRate,
        cv_feedback: job.cvFeedback,
        project_score: job.projectScore,
        project_feedback: job.projectFeedback,
        overall_summary: job.overallSummary
      }
    });
  } catch (err: any) {
    console.error("getResultController", err);
    return res.status(500).json({ message: err.message || "internal error" });
  }
};
