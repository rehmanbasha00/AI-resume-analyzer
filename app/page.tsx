"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import PathChooser from "@/components/PathChooser";
import ManualForm from "@/components/ManualForm";
import ComparisonView from "@/components/ComparisonView";
import EligibleRoles from "@/components/EligibleRoles";
import SkillGap from "@/components/SkillGap";
import InterviewPredictor from "@/components/InterviewPredictor";
import FindJobs from "@/components/FindJobs";
import Tabs from "@/components/Tabs";
import DownloadButtons from "@/components/DownloadButtons";
import { AnalyzeResult } from "@/lib/types";
import {
  guessExperienceFromResume,
  guessLocationFromResume,
} from "@/lib/resume-helpers";

type Step =
  | "upload"
  | "choose"
  | "loading"
  | "manual-form"
  | "compare"
  | "done";

const TABS = [
  "Final Resume",
  "Eligible Roles",
  "Skill Gap",
  "Interview Predictor",
  "Find Jobs",
];

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [currentResume, setCurrentResume] = useState("");
  const [pendingNew, setPendingNew] = useState("");
  const [pendingSuggestions, setPendingSuggestions] = useState<
    string[] | undefined
  >();
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loadingText, setLoadingText] = useState("");

  async function runAnalysis(resumeText: string) {
    setAnalysisLoading(true);
    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      setAnalysis(data);
    } finally {
      setAnalysisLoading(false);
    }
  }

  function handleExtracted(text: string) {
    setCurrentResume(text);
    setStep("choose");
  }

  async function handlePickAi() {
    setStep("loading");
    setLoadingText("AI is reading your resume...");
    const res = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText: currentResume }),
    });
    const data: AnalyzeResult = await res.json();
    setPendingNew(data.improvedResume);
    setPendingSuggestions(data.suggestions);
    setAnalysis(data);
    setStep("compare");
  }

  function handlePickManual() {
    setStep("manual-form");
  }

  async function handleManualSubmit(details: string) {
    setLoadingText("AI is adding your details...");
    const res = await fetch("/api/manual-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText: currentResume, userDetails: details }),
    });
    const data = await res.json();
    setPendingNew(data.improvedResume);
    setPendingSuggestions(undefined);
    setStep("compare");
  }

  async function handleAccept() {
    const finalResume = pendingNew;
    setCurrentResume(finalResume);
    setStep("done");
    if (!analysis || analysis.improvedResume !== finalResume) {
      runAnalysis(finalResume);
    }
  }

  function handleReject() {
    setStep("choose");
  }

  return (
    <main className="min-h-screen max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-heading text-2xl mb-1">
        Resume Analyzer & Career Advisor
      </h1>
      <p className="text-muted text-sm mb-8">
        Upload your resume, let AI improve it, and see what jobs fit you.
      </p>

      {step === "upload" && <UploadBox onExtracted={handleExtracted} />}

      {step === "choose" && (
        <PathChooser onPickAi={handlePickAi} onPickManual={handlePickManual} />
      )}

      {step === "manual-form" && (
        <ManualForm onSubmit={handleManualSubmit} loading={false} />
      )}

      {step === "loading" && (
        <p className="text-muted text-sm">{loadingText}</p>
      )}

      {step === "compare" && (
        <ComparisonView
          oldText={currentResume}
          newText={pendingNew}
          suggestions={pendingSuggestions}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {step === "done" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-success text-sm">Resume updated.</p>
            <button
              onClick={() => setStep("choose")}
              className="text-accent text-sm hover:underline"
            >
              Improve Again
            </button>
          </div>

          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

          {activeTab === "Final Resume" && (
            <div className="flex flex-col gap-4">
              <pre className="whitespace-pre-wrap text-sm rounded border border-border bg-surface p-4">
                {currentResume}
              </pre>
              <DownloadButtons resumeText={currentResume} />
            </div>
          )}

          {activeTab === "Eligible Roles" &&
            (analysisLoading ? (
              <p className="text-muted text-sm">Checking eligible roles...</p>
            ) : (
              analysis && <EligibleRoles roles={analysis.eligibleRoles} />
            ))}

          {activeTab === "Skill Gap" &&
            (analysisLoading ? (
              <p className="text-muted text-sm">Checking skill gaps...</p>
            ) : (
              analysis && <SkillGap gaps={analysis.skillGaps} />
            ))}

          {activeTab === "Interview Predictor" && (
            <InterviewPredictor
              defaultRole={analysis?.eligibleRoles?.[0]?.role || ""}
              defaultExperience={guessExperienceFromResume(currentResume)}
            />
          )}

          {activeTab === "Find Jobs" && (
            <FindJobs
              defaultRole={analysis?.eligibleRoles?.[0]?.role || ""}
              defaultLocation={guessLocationFromResume(currentResume)}
            />
          )}
        </div>
      )}
    </main>
  );
}
