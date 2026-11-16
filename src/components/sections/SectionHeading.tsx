export function SectionHeading({
  title,
  intro,
}: {
  title: string;
  intro?: string | null;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      <div aria-hidden className="mt-3 h-1 w-12 rounded-full bg-accent" />
      {intro && (
        <p className="mt-4 max-w-2xl whitespace-pre-line text-text-muted">{intro}</p>
      )}
    </div>
  );
}