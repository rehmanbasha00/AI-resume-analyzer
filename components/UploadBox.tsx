"use client";

import { useState } from "react";
import { extractTextFromPdf } from "@/lib/pdf-parser";

interface Props {
  onExtracted: (text: string) => void;
}

export default function UploadBox({ onExtracted }: Props) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setError("");
    setFileName(file.name);
    setLoading(true);

    try {
      const text = await extractTextFromPdf(file);
      onExtracted(text);
    } catch (err) {
      console.error(err);
      setError("Could not read this PDF. Try another file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-border rounded py-12 px-6 cursor-pointer hover:border-accent transition-colors"
      >
        <span className="font-heading text-lg">
          {loading ? "Reading your resume..." : "Upload your resume (PDF)"}
        </span>
        <span className="text-muted text-sm">
          {fileName ? fileName : "Click here to choose a file"}
        </span>
        <input
          id="resume-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
