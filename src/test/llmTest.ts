import { llmEvaluateCv, llmEvaluateProject, llmFinalSummary } from "../modules/evaluation/llm.evaluators";

async function runTest() {
  const jobTitle = "Backend Engineer";
  const cvText = "Experienced backend developer with Node.js, PostgreSQL, Redis...";
  const reportText = "This project demonstrates prompt chaining and a basic RAG pipeline.";

  console.log("Running CV evaluation...");
  const cv = await llmEvaluateCv(jobTitle, cvText);
  console.log("CV Result:", cv);

  console.log("\nRunning Project evaluation...");
  const prj = await llmEvaluateProject(reportText);
  console.log("Project Result:", prj);

  console.log("\nGenerating Final Summary...");
  const summary = await llmFinalSummary({ jobTitle, cvEval: cv, prjEval: prj });
  console.log("Summary:", summary);
}

runTest();
