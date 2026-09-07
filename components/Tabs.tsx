interface Props {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-2 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
            active === tab
              ? "border-accent text-accent font-heading"
              : "border-transparent text-muted hover:text-text"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
