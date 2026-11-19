// src/components/ProjectCard.tsx
import Link from "next/link";
import { Tag } from "./Tag";

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  featured?: boolean;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col rounded-md border border-border bg-bg-subtle p-4 transition-colors hover:border-accent has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <div className="flex items-center justify-between gap-2">
        <h3 className="min-w-0 flex-1">
          <Link
            href={`/projects/${project.slug}`}
            className="block truncate font-semibold text-accent group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        {project.featured && (
          <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-text-muted">
            Pinned
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm text-text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
        {project.tags.map((tag) => (
          <Tag key={tag.label} label={tag.label} color={tag.color} />
        ))}
      </div>
    </article>
  );
}