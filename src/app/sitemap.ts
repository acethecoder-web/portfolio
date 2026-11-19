import type { MetadataRoute } from "next";
import { getPublishedProjectSlugs } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  let projects: { slug: string; created_at: string }[] = [];
  try {
    projects = await getPublishedProjectSlugs();
  } catch {
  }

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${encodeURIComponent(p.slug)}`,
      lastModified: p.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}