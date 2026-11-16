"use server";

import { redirect } from "next/navigation";
import { archiveRow, deleteArchivedRow, refreshSite, restoreRow } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { HEX_COLOR_RE, UUID_RE, fail, readText, type FormState } from "@/lib/validation";

function parse(formData: FormData) {
  const name = readText(formData, "name");
  const color = readText(formData, "color");

  if (!name || name.length > 40) return { error: "Name is required (max 40 characters)." };
  if (!HEX_COLOR_RE.test(color)) return { error: "Pick a valid color." };

  return { values: { name, color } };
}

function friendly(error: { code?: string; message: string }) {
  return error.code === "23505"
    ? "A tag with that name already exists (it may be archived)."
    : `Could not save: ${error.message}`;
}

export async function createTag(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { error } = await supabase.from("tags").insert(parsed.values);
  if (error) return fail(friendly(error), formData);

  refreshSite();
  redirect("/admin/tags");
}

export async function updateTag(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return fail("Invalid id.", formData);
  const parsed = parse(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .update(parsed.values)
    .eq("id", id)
    .is("archived_at", null)
    .select("id");
  if (error) return fail(friendly(error), formData);
  if (!data || data.length === 0)
    return fail("Not found, archived, or you don't have permission.", formData);

  refreshSite();
  redirect("/admin/tags");
}

export async function archiveTag(id: string) {
  await archiveRow("tags", id);
  refreshSite();
  redirect("/admin/tags");
}

export async function restoreTag(id: string) {
  await restoreRow("tags", id);
  refreshSite();
  redirect("/admin/tags");
}

export async function deleteTagPermanently(id: string) {
  await deleteArchivedRow("tags", id);
  refreshSite();
  redirect("/admin/tags?view=archived");
}