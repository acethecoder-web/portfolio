import Link from "next/link";
import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";

export const metadata = {
  title: "Projects",
  description: "All published projects.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Container className="py-10">
      <Link href="/" className="font-mono text-sm text-text-muted hover:text-accent">
        ← home
      </Link>
      <div className="mt-6 rounded-xl border border-gh-border bg-gh-bg p-5 text-gh-text">
        <h1 className="text-2xl font-semibold">All projects</h1>
        <p className="mt-1 text-sm text-gh-muted">{projects.length} published</p>
        {projects.length === 0 ? (
          <p className="mt-6 text-sm text-gh-muted">No projects yet.</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}