"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  SLUG_RE,
  UUID_RE,
  fieldsFrom,
  isHttpUrl,
  slugify,
  type FormState,
} from "@/lib/validation";
import { archiveRow, deleteArchivedRow, restoreRow } from "@/lib/archive";
import { isStorageUrl } from "@/lib/storage";

function fail(error: string, formData: FormData): FormState {
  return {
    error,
    fields: fieldsFrom(formData),
    tagIds: formData.getAll("tag_ids").map(String),
  };
}

function parseProjectForm(formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? "").trim();

  const title = text("title");
  const description = text("description");
  const content = text("content");
  const slug = text("slug") || slugify(title);
  const cover = text("cover_image_url");
  const repo = text("repo_url");
  const live = text("live_url");
  const position = Number.parseInt(text("position") || "0", 10);

  if (!title || title.length > 120) return { error: "Title is required (max 120 characters)." };
  if (!description || description.length > 300) return { error: "Description is required (max 300 characters)." };
  if (!SLUG_RE.test(slug) || slug.length > 80)
    return { error: "Slug may only contain lowercase letters, numbers, and single hyphens." };
  if (content.length > 50000) return { error: "README is too long (max 50,000 characters)." };
if (cover && !isStorageUrl(cover)) return { error: "Cover image must be uploaded with the uploader." };  if (repo && !isHttpUrl(repo)) return { error: "Source code link must be an http(s) link." };
  if (live && !isHttpUrl(live)) return { error: "Live demo link must be an http(s) link." };
  if (!Number.isInteger(position) || position < 0 || position > 9999)
    return { error: "Position must be a whole number between 0 and 9999." };

  const tagIds = formData
    .getAll("tag_ids")
    .map(String)
    .filter((id) => UUID_RE.test(id));

  return {
    values: {
      slug,
      title,
      description,
      content: content || null,
      cover_image_url: cover || null,
      repo_url: repo || null,
      live_url: live || null,
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
      position,
    },
    tagIds,
  };
}

function friendlyError(error: { code?: string; message: string }) {
  return error.code === "23505"
    ? "That slug is already used by another project (it may be archived)."
    : `Could not save: ${error.message}`;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function createProject(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const parsed = parseProjectForm(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(parsed.values)
    .select("id")
    .single();
  if (error) return fail(friendlyError(error), formData);

  if (parsed.tagIds.length > 0) {
    const { error: tagError } = await supabase
      .from("project_tags")
      .insert(parsed.tagIds.map((tag_id) => ({ project_id: data.id, tag_id })));
    if (tagError) return fail(`Project created, but tags failed: ${tagError.message}`, formData);
  }

  refreshSite();
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return fail("Invalid project id.", formData);

  const parsed = parseProjectForm(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(parsed.values)
    .eq("id", id)
    .select("id");
  if (error) return fail(friendlyError(error), formData);
  if (!data || data.length === 0)
    return fail("Project not found, or you don't have permission to change it.", formData);

  // Replace tag links, but keep links to archived tags (the form doesn't show them).
  const { data: archivedTags } = await supabase
    .from("tags")
    .select("id")
    .not("archived_at", "is", null);
  const keep = (archivedTags ?? [])
    .map((t: { id: string }) => String(t.id))
    .filter((tagId: string) => UUID_RE.test(tagId));

  const clearBase = supabase.from("project_tags").delete().eq("project_id", id);
  const { error: clearError } =
    keep.length > 0
      ? await clearBase.not("tag_id", "in", `(${keep.join(",")})`)
      : await clearBase;
  if (clearError) return fail(`Could not update tags: ${clearError.message}`, formData);

  if (parsed.tagIds.length > 0) {
    const { error: tagError } = await supabase
      .from("project_tags")
      .insert(parsed.tagIds.map((tag_id) => ({ project_id: id, tag_id })));
    if (tagError) return fail(`Could not update tags: ${tagError.message}`, formData);
  }

  refreshSite();
  redirect("/admin/projects");
}

export async function archiveProject(id: string) {
  await archiveRow("projects", id, { is_published: false });
  refreshSite();
  redirect("/admin/projects");
}

export async function restoreProject(id: string) {
  await restoreRow("projects", id);
  refreshSite();
  redirect("/admin/projects");
}

export async function deleteProjectPermanently(id: string) {
  await deleteArchivedRow("projects", id);
  refreshSite();
  redirect("/admin/projects?view=archived");
}