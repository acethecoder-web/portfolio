export function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-text-muted">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}