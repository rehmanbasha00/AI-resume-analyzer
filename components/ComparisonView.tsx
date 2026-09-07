interface Props {
  oldText: string;
  newText: string;
  suggestions?: string[];
  onAccept: () => void;
  onReject: () => void;
}

export default function ComparisonView({
  oldText,
  newText,
  suggestions,
  onAccept,
  onReject,
}: Props) {
  return (
    <div className="rise-in flex flex-col gap-4">
      {suggestions && suggestions.length > 0 && (
        <div className="rounded border border-border bg-surface p-4">
          <p className="font-heading text-sm mb-2">What AI changed</p>
          <ul className="text-sm text-muted list-disc list-inside space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded border border-border bg-surface p-4">
          <p className="font-heading text-sm mb-2 text-muted">Old Resume</p>
          <pre className="whitespace-pre-wrap text-sm text-muted max-h-96 overflow-y-auto">
            {oldText}
          </pre>
        </div>
        <div className="rounded border border-accent bg-surface p-4">
          <p className="font-heading text-sm mb-2 text-accent">New Resume</p>
          <pre className="whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">
            {newText}
          </pre>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onAccept}
          className="rounded bg-success text-bg font-heading text-sm px-4 py-2"
        >
          Accept New Resume
        </button>
        <button
          onClick={onReject}
          className="rounded border border-border text-sm px-4 py-2 hover:border-danger"
        >
          Reject, Keep Old One
        </button>
      </div>
    </div>
  );
}
