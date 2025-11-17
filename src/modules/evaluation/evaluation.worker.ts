import Redis from "ioredis";
import { prisma } from "../../config/db";
import { extractTextFromPdf } from "../file/parsePdf";
import { backoff } from "../../lib/backoff";
import { llmEvaluateCv, llmEvaluateProject, llmFinalSummary } from "./llm.evaluators";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export function startEvaluationWorker() {
  console.log("[worker] evaluation worker started");
  processQueue().catch(err => console.error("[worker] fatal", err));
}

async function processQueue() {
  while (true) {
    // BRPOP blocks until item found; returns [listName, value]
    const res = await redis.brpop("evaluation_queue", 0);
    if (!res) continue;
    const jobId = res[1];
    console.log("[worker] got job", jobId);

    const job = await prisma.evaluationJob.findUnique({ where: { id: jobId } });
    if (!job) {
      console.warn("[worker] job not found", jobId);
      continue;
    }

    try {
      await prisma.evaluationJob.update({ where: { id: jobId }, data: { status: "processing" } });

      // Load file metadata from DB
      const cvFile = await prisma.file.findUnique({ where: { id: job.cvId } });
      const reportFile = await prisma.file.findUnique({ where: { id: job.reportId } });

      if (!cvFile || !reportFile) {
        await prisma.evaluationJob.update({
          where: { id: jobId },
          data: { status: "failed", resultJson: { error: "file not found" } }
        });
        continue;
      }

      // extract text
      const cvText = await extractTextFromPdf(cvFile.path);
      const reportText = await extractTextFromPdf(reportFile.path);

      // Evaluate CV (with retries & backoff)
      const cvEval = await backoff(() => llmEvaluateCv(job.jobTitle, cvText), { retries: 3, delay: 1000 });

      // Evaluate Project
      const prjEval = await backoff(() => llmEvaluateProject(reportText), { retries: 3, delay: 1000 });

      // Final summary
      const overallSummary = await backoff(() => llmFinalSummary({
        jobTitle: job.jobTitle,
        cvEval,
        prjEval
      }), { retries: 2, delay: 800 });

      // Save results
      await prisma.evaluationJob.update({
        where: { id: jobId },
        data: {
          status: "completed",
          cvMatchRate: cvEval.cv_match_rate,
          cvFeedback: cvEval.cv_feedback,
          projectScore: prjEval.project_score,
          projectFeedback: prjEval.project_feedback,
          overallSummary,
          resultJson: {
            cvEval,
            prjEval,
            overallSummary
          }
        }
      });

      console.log("[worker] completed job", jobId);
    } catch (err) {
      console.error("[worker] job error", jobId, err);
      await prisma.evaluationJob.update({
        where: { id: jobId },
        data: { status: "failed", resultJson: { error: String(err) } }
      });
    }
  }
}
