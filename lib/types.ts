// All the shapes of data we pass around.
// Keep this file simple, add new fields here only when needed.

export interface EligibleRole {
  role: string;
  reason: string;
}

export interface SkillGap {
  skill: string;
  benefit: string;
}

export interface AnalyzeResult {
  suggestions: string[];
  improvedResume: string;
  eligibleRoles: EligibleRole[];
  skillGaps: SkillGap[];
}

export interface InterviewRound {
  name: string;
  questions: string[];
}

export interface InterviewPlan {
  rounds: InterviewRound[];
  expectedLPA: string;
}
