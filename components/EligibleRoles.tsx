import { EligibleRole } from "@/lib/types";

export default function EligibleRoles({ roles }: { roles: EligibleRole[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {roles.map((r, i) => (
        <div key={i} className="rounded border border-border bg-surface p-4">
          <p className="font-heading text-sm mb-1">{r.role}</p>
          <p className="text-muted text-sm">{r.reason}</p>
        </div>
      ))}
    </div>
  );
}
