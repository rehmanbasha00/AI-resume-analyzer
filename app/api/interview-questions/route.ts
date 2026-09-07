import { NextRequest, NextResponse } from "next/server";
import { askClaude, parseJsonReply } from "@/lib/claude";
import { interviewPlanPrompt, moreQuestionsPrompt } from "@/lib/prompts";
import { InterviewPlan } from "@/lib/types";

// This one route does two jobs, picked by the "mode" field:
// mode "plan"  -> full interview plan for a role
// mode "more"  -> 5 extra questions for one round

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    if (body.mode === "more") {
      const { role, experience, roundName, alreadyAsked } = body;
      const raw = await askClaude(
        moreQuestionsPrompt(role, experience, roundName, alreadyAsked || [])
      );
      const result = parseJsonReply<{ questions: string[] }>(raw);
      return NextResponse.json(result);
    }

    const { role, experience } = body;
    const raw = await askClaude(interviewPlanPrompt(role, experience));
    const result = parseJsonReply<InterviewPlan>(raw);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI could not build the interview plan" }, { status: 500 });
  }
}
