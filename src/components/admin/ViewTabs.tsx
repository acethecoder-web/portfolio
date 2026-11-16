import Link from "next/link";

export function ViewTabs({
  basePath,
  archived,
}: {
  basePath: string;
  archived: boolean;
}) {
  const tab = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm ${
      active ? "bg-bg-subtle font-semibold text-accent" : "text-text-muted hover:text-accent"
    }`;

  return (
    <div className="mt-4 flex gap-2 border-b border-border pb-2">
      <Link href={basePath} className={tab(!archived)}>
        Active
      </Link>
      <Link href={`${basePath}?view=archived`} className={tab(archived)}>
        Archived
      </Link>
    </div>
  );
}