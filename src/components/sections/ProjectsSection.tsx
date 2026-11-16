import { ProjectCard, type Project } from "@/components/ProjectCard";
import type { Section } from "@/lib/data";
import Link from "next/link";

export function ProjectsSection({
  section,
  projects,
}: {
  section: Section;
  projects: Project[];
}) {
  return (
    <section id="projects">
      <div className="rounded-xl border border-gh-border bg-gh-bg p-5 text-gh-text">
        <h2 className="font-mono text-sm text-gh-muted">
          // {section.title.toLowerCase()}
        </h2>
        {section.body && (
  <p className="mt-1 text-sm text-gh-muted">{section.body}</p>
)}
        {projects.length === 0 ? (
          <p className="mt-4 text-sm text-gh-muted">No projects yet.</p>
        ) : (
            <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {projects.slice(0, 6).map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
           <Link
              href="/projects"
              className="mt-5 inline-block text-sm text-gh-link hover:underline"
            >
              View all projects →
            </Link>
          </>
        )}
      </div>
    </section>
  );
}