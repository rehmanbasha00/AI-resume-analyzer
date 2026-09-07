"use client";

import { useState } from "react";

interface Props {
  onSubmit: (details: string) => void;
  loading: boolean;
}

export default function ManualForm({ onSubmit, loading }: Props) {
  const [details, setDetails] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Type your new skills, project, or experience here. Don't worry about grammar, AI will fix it."
        rows={6}
        className="w-full rounded border border-border bg-surface p-3 text-sm outline-none focus:border-accent"
      />
      <button
        onClick={() => onSubmit(details)}
        disabled={!details.trim() || loading}
        className="self-start rounded bg-accent text-bg font-heading text-sm px-4 py-2 disabled:opacity-40"
      >
        {loading ? "Updating with AI..." : "Update with AI"}
      </button>
    </div>
  );
}
