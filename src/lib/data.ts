import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/components/ProjectCard";
import { cache } from "react";

export type SiteSettings = {
  site_name: string;
  tagline: string;
  bio: string | null;
  accent_color: string;
  social_links: Record<string, string>;
  avatar_url: string | null;
};

export type Section = {
  id: string;
  key: string;
  title: string;
  body: string | null;
  position: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  company_logo_url: string | null;
  quote: string;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("site_name, tagline, bio, accent_color, avatar_url, social_links")
    .eq("id", 1)
    .single();
  if (error) throw new Error(`site_settings: ${error.message}`);
  return data;
});

export const getSections = cache(async (): Promise<Section[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id, key, title, body, position")
    .eq("is_visible", true)
    .order("position");
  if (error) throw new Error(`sections: ${error.message}`);
  return data ?? [];
});

type ProjectRow = {
  slug: string;
  title: string;
  description: string;
  is_featured: boolean;
  project_tags: {
    tags: { name: string; color: string; archived_at: string | null } | null;
  }[];
};


export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "slug, title, description, is_featured, project_tags(tags(name, color, archived_at))"
    )
    .is("archived_at", null)
    .order("is_featured", { ascending: false })
    .order("position");
  if (error) throw new Error(`projects: ${error.message}`);

  const rows = (data ?? []) as unknown as ProjectRow[];
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    featured: row.is_featured,
    tags: row.project_tags.flatMap((pt) =>
      pt.tags && !pt.tags.archived_at
        ? [{ label: pt.tags.name, color: pt.tags.color }]
        : []
    ),
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, role, company, company_logo_url, quote")
    .eq("is_visible", true)
    .is("archived_at", null)
    .order("position");
  if (error) throw new Error(`testimonials: ${error.message}`);
  return data ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url")
    .eq("is_visible", true)
    .is("archived_at", null)
    .order("position");
  if (error) throw new Error(`partners: ${error.message}`);
  return data ?? [];
}

export type ProjectDetail = {
  slug: string;
  title: string;
  description: string;
  content: string | null;
  cover_image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
tags: { label: string; color: string }[];
  images: { id: string; image_url: string; alt_text: string | null }[];
};

type ProjectDetailRow = Omit<ProjectDetail, "tags" | "images"> & {
  project_tags: {
    tags: { name: string; color: string; archived_at: string | null } | null;
  }[];
project_images: { id: string; image_url: string; alt_text: string | null; archived_at: string | null }[];};

export const getProject = cache(
  async (slug: string): Promise<ProjectDetail | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug, title, description, content, cover_image_url, repo_url, live_url, project_tags(tags(name, color, archived_at)), project_images(id, image_url, alt_text, archived_at))"
      )
      .eq("is_published", true)
      .eq("slug", slug)
      .eq("is_published", true)
      .is("archived_at", null)
      .order("position", { referencedTable: "project_images" })
      .maybeSingle();

    if (error) throw new Error(`project: ${error.message}`);
    if (!data) return null;

    const row = data as unknown as ProjectDetailRow;
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      content: row.content,
      cover_image_url: row.cover_image_url,
      repo_url: row.repo_url,
      live_url: row.live_url,
      tags: row.project_tags.flatMap((pt) =>
        pt.tags && !pt.tags.archived_at
          ? [{ label: pt.tags.name, color: pt.tags.color }]
          : []
      ),
images: row.project_images
  .filter((img) => !img.archived_at)
  .map(({ id, image_url, alt_text }) => ({ id, image_url, alt_text })),    };
  }
);

export async function getPublishedProjectSlugs(): Promise<
  { slug: string; created_at: string }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("slug, created_at")
    .eq("is_published", true)
    .is("archived_at", null)
    .order("position");
  if (error) throw new Error(`projects: ${error.message}`);
  return (data ?? []) as { slug: string; created_at: string }[];
}