"use client";

import { downloadResumeDoc, downloadResumePdf } from "@/lib/download-resume";

export default function DownloadButtons({ resumeText }: { resumeText: string }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => downloadResumePdf(resumeText)}
        className="rounded border border-border text-sm px-4 py-2 hover:border-accent"
      >
        Download PDF
      </button>
      <button
        onClick={() => downloadResumeDoc(resumeText)}
        className="rounded border border-border text-sm px-4 py-2 hover:border-accent"
      >
        Download DOC
      </button>
    </div>
  );
}
