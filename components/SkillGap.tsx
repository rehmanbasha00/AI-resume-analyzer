import { SkillGap as SkillGapItem } from "@/lib/types";

export default function SkillGap({ gaps }: { gaps: SkillGapItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {gaps.map((g, i) => (
        <div key={i} className="rounded border border-border bg-surface p-4 flex gap-3">
          <span className="rounded bg-accentSoft text-accent text-xs font-heading px-2 py-1 h-fit">
            {g.skill}
          </span>
          <p className="text-muted text-sm">{g.benefit}</p>
        </div>
      ))}
    </div>
  );
}
