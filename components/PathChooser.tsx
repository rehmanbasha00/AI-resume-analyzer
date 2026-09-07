interface Props {
  onPickAi: () => void;
  onPickManual: () => void;
}

export default function PathChooser({ onPickAi, onPickManual }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <button
        onClick={onPickAi}
        className="rounded border border-border bg-surface hover:border-accent transition-colors p-5 text-left"
      >
        <p className="font-heading text-base mb-1">🤖 Let AI Improve My Resume</p>
        <p className="text-muted text-sm">AI reads your resume and fixes it for you.</p>
      </button>

      <button
        onClick={onPickManual}
        className="rounded border border-border bg-surface hover:border-accent transition-colors p-5 text-left"
      >
        <p className="font-heading text-base mb-1">✍️ I'll Add My Own Details</p>
        <p className="text-muted text-sm">Type new skills or experience, AI will format it in.</p>
      </button>
    </div>
  );
}
