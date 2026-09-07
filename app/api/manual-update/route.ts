import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";
import { manualUpdatePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { resumeText, userDetails } = await req.json();

  if (!resumeText || !userDetails) {
    return NextResponse.json({ error: "Missing resume or details" }, { status: 400 });
  }

  try {
    const improvedResume = await askClaude(manualUpdatePrompt(resumeText, userDetails));
    return NextResponse.json({ improvedResume });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI could not update this resume" }, { status: 500 });
  }
}
