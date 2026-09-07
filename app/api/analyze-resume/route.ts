import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseJsonReply } from "@/lib/claude";
import { analyzeResumePrompt } from "@/lib/prompts";
import { AnalyzeResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { resumeText } = await req.json();

  if (!resumeText) {
    return NextResponse.json({ error: "Resume text is missing" }, { status: 400 });
  }

  try {
    const raw = await askClaude(analyzeResumePrompt(resumeText));
    const result = parseJsonReply<AnalyzeResult>(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI could not analyze this resume" }, { status: 500 });
  }
}
