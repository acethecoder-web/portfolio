import { createClient } from "@/lib/supabase/server";
import { UUID_RE } from "@/lib/validation";

export type AdminProjectRow = {
  id: string;
  slug: string;
  title: string;
  is_featured: boolean;
  is_published: boolean;
  position: number;
  archived_at?: string | null;
};

export type AdminProject = AdminProjectRow & {
  description: string;
  content: string | null;
  cover_image_url: string | null;
  repo_url: string | null;
  live_url: string | null;
  tag_ids: string[];
};

export type AdminTag = { id: string; name: string; color: string };

export async function getAdminProjects(archived = false): Promise<AdminProjectRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("id, slug, title, is_featured, is_published, position, archived_at");

  query = archived
    ? query.not("archived_at", "is", null)
    : query.is("archived_at", null);

  const { data, error } = await query
    .order("position")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`projects: ${error.message}`);
  return data ?? [];
}

export async function getAdminProject(id: string): Promise<AdminProject | null> {
  if (!UUID_RE.test(id)) return null; 

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, description, content, cover_image_url, repo_url, live_url, is_featured, is_published, position, project_tags(tag_id)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`project: ${error.message}`);
  if (!data) return null;

  const { project_tags, ...rest } = data as typeof data & {
    project_tags: { tag_id: string }[];
  };
return {
  ...(rest as Omit<AdminProject, "tag_ids">),
  tag_ids: project_tags.map((t: { tag_id: string }) => t.tag_id),
};}

export async function getAllTags(): Promise<AdminTag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name, color")
    .is("archived_at", null)
    .order("name");
  if (error) throw new Error(`tags: ${error.message}`);
  return data ?? [];
}

async function listRows<T>(
  table: string,
  columns: string,
  archived: boolean,
  orderBy: string
): Promise<T[]> {
  const supabase = await createClient();
  const base = supabase.from(table).select(columns);
  const filtered = archived
    ? base.not("archived_at", "is", null)
    : base.is("archived_at", null);
  const { data, error } = await filtered.order(orderBy);
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []) as unknown as T[];
}

async function getRow<T>(table: string, id: string, columns: string): Promise<T | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data as unknown as T) ?? null;
}

export type AdminTestimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  company_logo_url: string | null;
  quote: string;
  is_visible: boolean;
  position: number;
  archived_at: string | null;
};
const TESTIMONIAL_COLS =
  "id, name, role, company, company_logo_url, quote, is_visible, position, archived_at";

export const getAdminTestimonials = (archived = false) =>
  listRows<AdminTestimonial>("testimonials", TESTIMONIAL_COLS, archived, "position");
export const getAdminTestimonial = (id: string) =>
  getRow<AdminTestimonial>("testimonials", id, TESTIMONIAL_COLS);

export type AdminPartner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_visible: boolean;
  position: number;
  archived_at: string | null;
};
const PARTNER_COLS = "id, name, logo_url, website_url, is_visible, position, archived_at";

export const getAdminPartners = (archived = false) =>
  listRows<AdminPartner>("partners", PARTNER_COLS, archived, "position");
export const getAdminPartner = (id: string) =>
  getRow<AdminPartner>("partners", id, PARTNER_COLS);

export type AdminTagFull = AdminTag & { archived_at: string | null };
const TAG_COLS = "id, name, color, archived_at";

export const getAdminTags = (archived = false) =>
  listRows<AdminTagFull>("tags", TAG_COLS, archived, "name");
export const getAdminTag = (id: string) => getRow<AdminTagFull>("tags", id, TAG_COLS);

export type AdminSection = {
  id: string;
  key: string;
  title: string;
  body: string | null;
  position: number;
  is_visible: boolean;
};

const SECTION_COLS = "id, key, title, body, position, is_visible";

export async function getAdminSections(): Promise<AdminSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select(SECTION_COLS)
    .order("position")
    .order("id");
  if (error) throw new Error(`sections: ${error.message}`);
  return (data ?? []) as unknown as AdminSection[];
}

export async function getAdminSection(id: string): Promise<AdminSection | null> {
  if (!UUID_RE.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select(SECTION_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`section: ${error.message}`);
  return (data as unknown as AdminSection) ?? null;
}
