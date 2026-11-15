import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ProjectCard, type Project } from "@/components/ProjectCard";


const sampleProjects: Project[] = [
  {
    slug: "sample-one",
    title: "sample-project-one",
    description: "A short description of what this project does and why it matters.",
    tags: [
      { label: "Next.js", color: "#3178c6" },
      { label: "Supabase", color: "#3ecf8e" },
    ],
    featured: true,
  },
  {
    slug: "sample-two",
    title: "sample-project-two",
    description: "Another project, with a slightly longer description to test how cards line up.",
    tags: [{ label: "TypeScript", color: "#3178c6" }],
    featured: true,
  },
  {
    slug: "sample-three",
    title: "sample-project-three",
    description: "A third placeholder so the grid has three columns on wide screens.",
    tags: [
      { label: "Tailwind", color: "#38bdf8" },
      { label: "Vercel", color: "#e6edf3" },
    ],
  },
];

export default function Home() {
  return (
    <Container className="py-10">
      <section>
        <p className="font-mono text-sm text-accent">hello, world</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Aces S. Hapiz</h1>
        <p className="mt-3 max-w-xl text-text-muted">
          SOFTWARE ENGINEER || BUSINESS ANALYST || DATA ANALYST
        </p>
        <div className="mt-6">
          <Button>View projects</Button>
        </div>
      </section>

      <section id="projects" className="mt-14">
        <h2 className="font-mono text-sm text-text-muted">// pinned projects</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sampleProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </Container>
  );
}