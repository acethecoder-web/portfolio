import { createClient } from "@/lib/server";
import type { Project } from "@/components/ProjectCard";
import { cache } from "react";

export type SiteSettings = {
  site_name: string;
  tagline: string;
  bio: string | null;
  accent_color: string;
  social_links: Record<string, string>;
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
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("site_name, tagline, bio, accent_color, social_links")
    .eq("id", 1)
    .single();
  if (error) throw new Error(`site_settings: ${error.message}`);
  return data;
}

export async function getSections(): Promise<Section[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id, key, title, body, position")
    .order("position");
  if (error) throw new Error(`sections: ${error.message}`);
  return data ?? [];
}

type ProjectRow = {
  slug: string;
  title: string;
  description: string;
  is_featured: boolean;
  project_tags: { tags: { name: string; color: string } }[];
};

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "slug, title, description, is_featured, project_tags(tags(name, color))"
    )
    .order("is_featured", { ascending: false })
    .order("position");
  if (error) throw new Error(`projects: ${error.message}`);

  const rows = (data ?? []) as unknown as ProjectRow[];
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    featured: row.is_featured,
    tags: row.project_tags.map((pt) => ({
      label: pt.tags.name,
      color: pt.tags.color,
    })),
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, role, company, company_logo_url, quote")
    .order("position");
  if (error) throw new Error(`testimonials: ${error.message}`);
  return data ?? [];
}

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url")
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
  project_tags: { tags: { name: string; color: string } }[];
  project_images: { id: string; image_url: string; alt_text: string | null }[];
};

export const getProject = cache(
  async (slug: string): Promise<ProjectDetail | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "slug, title, description, content, cover_image_url, repo_url, live_url, project_tags(tags(name, color)), project_images(id, image_url, alt_text)"
      )
      .eq("slug", slug)
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
      tags: row.project_tags.map((pt) => ({
        label: pt.tags.name,
        color: pt.tags.color,
      })),
      images: row.project_images,
    };
  }
);