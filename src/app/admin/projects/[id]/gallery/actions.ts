"use server";

import { redirect } from "next/navigation";
import { archiveRow, deleteArchivedRow, refreshSite } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { isStorageUrl } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";
import { UUID_RE, fail, readText, type FormState } from "@/lib/validation";

const MAX_SNAPSHOTS = 12;

const back = (projectId: string, view?: "archived") =>
  `/admin/projects/${projectId}/gallery${view ? "?view=archived" : ""}`;

export async function addGalleryImage(
  projectId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  if (!UUID_RE.test(projectId)) return fail("Invalid project.", formData);

  const image_url = readText(formData, "image_url");
  const alt_text = readText(formData, "alt_text");
  if (!isStorageUrl(image_url)) return fail("Upload a snapshot first.", formData);
  if (alt_text.length > 200)
    return fail("Caption is too long (max 200 characters).", formData);

  const supabase = await createClient();

  const { count } = await supabase
    .from("project_images")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .is("archived_at", null);
  if ((count ?? 0) >= MAX_SNAPSHOTS)
    return fail(`A project can have up to ${MAX_SNAPSHOTS} snapshots. Archive one first.`, formData);

  const { data: last } = await supabase
    .from("project_images")
    .select("position")
    .eq("project_id", projectId)
    .is("archived_at", null)
    .order("position", { ascending: false })
    .limit(1);
  const position = (last?.[0]?.position ?? 0) + 1;

  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    image_url,
    alt_text: alt_text || null,
    position,
  });
  if (error) return fail(`Could not save: ${error.message}`, formData);

  refreshSite();
  redirect(back(projectId));
}

export async function updateGalleryCaption(
  projectId: string,
  id: string,
  formData: FormData
) {
  await requireAdmin();
  if (!UUID_RE.test(projectId) || !UUID_RE.test(id)) return;

  const alt_text = readText(formData, "alt_text");
  if (alt_text.length > 200) throw new Error("Caption is too long.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_images")
    .update({ alt_text: alt_text || null })
    .eq("id", id)
    .eq("project_id", projectId)
    .is("archived_at", null)
    .select("id");
  if (error || !data || data.length === 0)
    throw new Error("Could not save the caption.");

  refreshSite();
}

export async function moveGalleryImage(
  projectId: string,
  id: string,
  direction: "up" | "down"
) {
  await requireAdmin();
  if (
    !UUID_RE.test(projectId) ||
    !UUID_RE.test(id) ||
    (direction !== "up" && direction !== "down")
  )
    return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_images")
    .select("id")
    .eq("project_id", projectId)
    .is("archived_at", null)
    .order("position")
    .order("id");
  if (error || !data) throw new Error("Could not load snapshots.");

  const ids = data.map((row: { id: string }) => row.id);
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= ids.length) return;

  [ids[index], ids[target]] = [ids[target], ids[index]];

  const { error: rpcError } = await supabase.rpc("reorder_project_images", {
    p_project_id: projectId,
    ordered_ids: ids,
  });
  if (rpcError) throw new Error("Could not reorder snapshots.");

  refreshSite();
}

export async function archiveGalleryImage(projectId: string, id: string) {
  await archiveRow("project_images", id);
  refreshSite();
  redirect(back(projectId));
}

export async function restoreGalleryImage(projectId: string, id: string) {
  await requireAdmin();
  if (!UUID_RE.test(projectId) || !UUID_RE.test(id)) return;

  const supabase = await createClient();
  const { data: last } = await supabase
    .from("project_images")
    .select("position")
    .eq("project_id", projectId)
    .is("archived_at", null)
    .order("position", { ascending: false })
    .limit(1);
  const position = (last?.[0]?.position ?? 0) + 1; // restored images go to the end

  const { data, error } = await supabase
    .from("project_images")
    .update({ archived_at: null, position })
    .eq("id", id)
    .eq("project_id", projectId)
    .not("archived_at", "is", null)
    .select("id");
  if (error || !data || data.length === 0)
    throw new Error("Could not restore the snapshot.");

  refreshSite();
  redirect(back(projectId));
}

export async function deleteGalleryImagePermanently(projectId: string, id: string) {
  await deleteArchivedRow("project_images", id);
  refreshSite();
  redirect(back(projectId, "archived"));
}