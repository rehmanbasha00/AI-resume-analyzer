"use client";

import { useEffect, useState } from "react";
import { InterviewPlan } from "@/lib/types";

interface Props {
  defaultRole?: string;
  defaultExperience?: string;
}

export default function InterviewPredictor({ defaultRole = "", defaultExperience = "" }: Props) {
  const [role, setRole] = useState(defaultRole);
  const [experience, setExperience] = useState(defaultExperience);
  const [plan, setPlan] = useState<InterviewPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  // fills the box from resume data, only if user has not typed anything yet
  useEffect(() => {
    if (defaultRole && !role) setRole(defaultRole);
  }, [defaultRole]);

  useEffect(() => {
    if (defaultExperience && !experience) setExperience(defaultExperience);
  }, [defaultExperience]);

  async function getPlan() {
    if (!role.trim() || !experience.trim()) return;
    setLoading(true);
    setPlan(null);
    setError("");
    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "plan", role, experience }),
      });
      const data = await res.json();

      if (!res.ok || !data.rounds) {
        setError("AI se sahi jawab nahi aaya, dobara try karo.");
        return;
      }

      setPlan(data);
    } catch (err) {
      setError("Kuch gadbad hui, dobara try karo.");
    } finally {
      setLoading(false);
    }
  }

  async function getMoreQuestions(roundIndex: number) {
    if (!plan) return;
    setMoreLoading(roundIndex);
    try {
      const round = plan.rounds[roundIndex];
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "more",
          role,
          experience,
          roundName: round.name,
          alreadyAsked: round.questions,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.questions) return;
      const updatedRounds = [...plan.rounds];
      updatedRounds[roundIndex] = {
        ...round,
        questions: [...round.questions, ...data.questions],
      };
      setPlan({ ...plan, rounds: updatedRounds });
    } finally {
      setMoreLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role, e.g. Frontend Developer"
          className="rounded border border-border bg-surface p-2.5 text-sm outline-none focus:border-accent"
        />
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Experience, e.g. 2 years"
          className="rounded border border-border bg-surface p-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <button
        onClick={getPlan}
        disabled={loading}
        className="self-start rounded bg-accent text-bg font-heading text-sm px-4 py-2 disabled:opacity-40"
      >
        {loading ? "Building interview plan..." : "Predict Interview Rounds"}
      </button>

      {error && <p className="text-danger text-sm">{error}</p>}

      {plan && (
        <div className="flex flex-col gap-4 rise-in">
          <div className="rounded border border-accent bg-accentSoft p-3 text-sm w-fit">
            Expected Salary: <span className="text-accent font-heading">{plan.expectedLPA}</span>
          </div>

          {plan.rounds.map((round, i) => (
            <div key={i} className="rounded border border-border bg-surface p-4">
              <p className="font-heading text-sm mb-3">{round.name}</p>
              <ol className="text-sm text-muted list-decimal list-inside space-y-1.5">
                {round.questions.map((q, qi) => (
                  <li key={qi}>{q}</li>
                ))}
              </ol>
              <button
                onClick={() => getMoreQuestions(i)}
                disabled={moreLoading === i}
                className="mt-3 text-accent text-sm hover:underline disabled:opacity-40"
              >
                {moreLoading === i ? "Loading..." : "+ Get 5 more questions"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
