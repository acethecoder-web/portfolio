export function SectionHeading({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-accent-2">
        </p>
      )}
      <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}