import { openaiClient } from "../../lib/openai";

/**
 * llmEvaluateCv:
 * - input: jobTitle, cvText
 * - returns: { cv_match_rate: number, cv_feedback: string }
 */
export async function llmEvaluateCv(jobTitle: string, cvText: string) {
  if (!openaiClient) {
    const jt = jobTitle.toLowerCase().split(/\s+/);
    let hits = 0;
    for (const w of jt) if (cvText.toLowerCase().includes(w)) hits++;
    const rate = Math.min(1, Math.round((hits / Math.max(1, jt.length)) * 100) / 100);

    return {
      cv_match_rate: parseFloat((rate * 1.0).toFixed(2)),
      cv_feedback: `Mocked: ${hits} term(s) from job title found in CV`
    };
  }

  const prompt = `
You are an assistant that evaluates CVs against a job title.
Job Title: ${jobTitle}
Candidate CV text:
${cvText}

Return a JSON object with keys:
- cv_match_rate (float between 0 and 1)
- cv_feedback (short string)

Only return JSON.
`;

  const resp = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 400
  });

  const text = resp.choices[0].message?.content ?? "";

  try {
    return JSON.parse(text);
  } catch {
    return { cv_match_rate: 0.0, cv_feedback: text.trim().slice(0, 800) };
  }
}

/**
 * llmEvaluateProject:
 * - input: projectText
 * - returns: { project_score: number (1-5), project_feedback: string }
 */
export async function llmEvaluateProject(projectText: string) {
  if (!openaiClient) {
    return {
      project_score: 3.5,
      project_feedback: "Mocked project eval: OK, meets baseline requirements."
    };
  }

  const prompt = `
You are an assistant that scores a project report against a case study brief.
Return JSON with:
- project_score (float 1.0-5.0)
- project_feedback (string)
Only return JSON.

Report:
${projectText}
`;

  const resp = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 400
  });

  const text = resp.choices[0].message?.content ?? "";

  try {
    return JSON.parse(text);
  } catch {
    return { project_score: 3.0, project_feedback: text.trim().slice(0, 800) };
  }
}

/**
 * llmFinalSummary
 * - input: { jobTitle, cvEval, prjEval }
 * - returns: string
 */
export async function llmFinalSummary({ jobTitle, cvEval, prjEval }: any) {
  if (!openaiClient) {
    return `Mocked overall: CV rate ${cvEval.cv_match_rate}, project ${prjEval.project_score}.`;
  }

  const prompt = `
You are an assistant that synthesizes final recommendation for a candidate.
JobTitle: ${jobTitle}
CV evaluation: ${JSON.stringify(cvEval)}
Project evaluation: ${JSON.stringify(prjEval)}

Return a concise overall summary (1-3 sentences).
`;

  const resp = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 200
  });

  return resp.choices[0].message?.content?.trim() ?? "";
}
