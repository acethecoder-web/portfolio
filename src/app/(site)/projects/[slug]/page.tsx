// src/app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import { Tag } from "@/components/Tag";
import { getProject } from "@/lib/data";
import { safeUrl } from "@/lib/url";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const repoUrl = safeUrl(project.repo_url);
  const liveUrl = safeUrl(project.live_url);

  return (
    <Container className="py-10">
      <Link href="/projects" className="font-mono text-sm text-text-muted hover:text-accent">
        ← all projects
      </Link>

      <article className="mt-6 overflow-hidden rounded-xl border border-gh-border bg-gh-bg text-gh-text">
        <header className="border-b border-gh-border p-5 sm:p-6">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="mt-2 text-gh-muted">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {project.tags.map((tag) => (
                <Tag key={tag.label} label={tag.label} color={tag.color} />
              ))}
            </div>
          )}

          {(repoUrl || liveUrl) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gh-link px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110"
                >
                  Live demo
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-gh-border px-4 py-1.5 text-sm font-semibold hover:bg-gh-subtle"
                >
                  Source code
                </a>
              )}
            </div>
          )}
        </header>

        <div className="border-b border-gh-border bg-gh-subtle px-5 py-2 font-mono text-xs text-gh-muted sm:px-6">
          README.md
        </div>

        <div className="p-5 sm:p-8">
          {project.cover_image_url && (
            <img
              src={project.cover_image_url}
              alt={`${project.title} cover`}
              className="mb-6 w-full rounded-md border border-gh-border"
            />
          )}

          {project.content ? (
            <Markdown>{project.content}</Markdown>
          ) : (
            <p className="text-sm text-gh-muted">No README for this project yet.</p>
          )}

          {project.images.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 border-b border-gh-border pb-2 text-xl font-semibold">
                Gallery
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={img.alt_text ?? `${project.title} screenshot`}
                    loading="lazy"
                    className="w-full rounded-md border border-gh-border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </Container>
  );
}