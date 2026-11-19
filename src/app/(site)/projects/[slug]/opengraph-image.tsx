import { getProject, getSiteSettings } from "@/lib/data";
import { renderOg } from "@/lib/og";
import { HEX_COLOR_RE } from "@/lib/validation";

export const alt = "Project preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let accent = "#00ff41";
  let siteName = "Portfolio";
  try {
    const s = await getSiteSettings();
    siteName = s.site_name;
    if (HEX_COLOR_RE.test(s.accent_color)) accent = s.accent_color;
  } catch {
  }

  const project = await getProject(slug);
  return renderOg({
    eyebrow: `~/${siteName.slice(0, 30)}/projects`,
    title: (project?.title ?? "Project").slice(0, 60),
    subtitle: project
      ? project.description.slice(0, 140)
      : "This project could not be found.",
    accent,
  });
}