export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-obsidian/50 font-heading mb-1">{title}</p>
        {subtitle && <p className="text-sm text-obsidian/50 font-body">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}