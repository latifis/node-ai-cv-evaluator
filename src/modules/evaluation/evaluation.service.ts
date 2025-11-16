import { prisma } from "../../config/db";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const evaluationService = {
  enqueueJob: async (jobTitle: string, cvId: string, reportId: string) => {
    const job = await prisma.evaluationJob.create({
      data: {
        jobTitle,
        cvId,
        reportId,
        status: "queued",
        cvMatchRate: null,
        cvFeedback: null,
        projectScore: null,
        projectFeedback: null,
        overallSummary: null
      }
    });

    await redis.lpush("evaluation_queue", job.id);
    return job;
  },

  getJob: async (id: string) => {
    return prisma.evaluationJob.findUnique({ where: { id } });
  }
};
