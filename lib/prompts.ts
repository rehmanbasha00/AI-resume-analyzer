// Every prompt we send to AI lives here.
// If you want to change how AI replies, edit this file only.

const STRICT_JSON = "Reply with ONLY raw JSON, no markdown, no explanation, no code fences.\n\n";

export function analyzeResumePrompt(resumeText: string) {
  return `${STRICT_JSON}You are a career advisor. Read this resume and reply with ONLY a JSON object, no other text.

Resume:
"""
${resumeText}
"""

Reply in this exact JSON shape:
{
  "suggestions": ["short suggestion 1", "short suggestion 2", "..."],
  "improvedResume": "the full resume text, rewritten better, same format style",
  "eligibleRoles": [{ "role": "Frontend Developer", "reason": "one line reason" }],
  "skillGaps": [{ "skill": "Next.js", "benefit": "one line, what extra roles this opens up" }]
}

Give 4 to 6 suggestions, 3 to 5 eligible roles, and 3 to 5 skill gaps.
Keep every reason and benefit under 20 words.`;
}

export function manualUpdatePrompt(resumeText: string, userDetails: string) {
  return `You are a resume editor. A user wants to add new details to their resume.
Take their raw details below and rewrite them properly (fix grammar, tone, structure),
then merge them into the resume in the right section. Keep the rest of the resume same.

Reply with ONLY the full updated resume text. No JSON, no extra notes.

Current resume:
"""
${resumeText}
"""

New details from user (raw, needs polishing):
"""
${userDetails}
"""`;
}

export function interviewPlanPrompt(role: string, experience: string) {
  return `${STRICT_JSON}You are a career advisor. Give a typical interview plan for this role.

Role: ${role}
Experience: ${experience}

Reply with ONLY a JSON object, no other text, in this exact shape:
{
  "expectedLPA": "e.g. 6-10 LPA",
  "rounds": [
    { "name": "Round name, e.g. Online Assessment", "questions": ["question 1", "... exactly 15 questions"] }
  ]
}

Give 3 to 5 rounds that are typical for this role and experience level.
Each round must have exactly 15 questions.`;
}

export function moreQuestionsPrompt(
  role: string,
  experience: string,
  roundName: string,
  alreadyAsked: string[]
) {
  return `${STRICT_JSON}You are a career advisor. Give 5 more interview questions for this round.

Role: ${role}
Experience: ${experience}
Round: ${roundName}

Do not repeat these questions, which were already given:
${alreadyAsked.map((q) => `- ${q}`).join("\n")}

Reply with ONLY a JSON object: { "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"] }`;
}
