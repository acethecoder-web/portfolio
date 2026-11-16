"use server";

import { redirect } from "next/navigation";
import { refreshSite } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UUID_RE, fail, readText, type FormState } from "@/lib/validation";

export async function moveSection(id: string, direction: "up" | "down") {
  await requireAdmin();
  if (!UUID_RE.test(id) || (direction !== "up" && direction !== "down")) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("id")
    .order("position")
    .order("id");
  if (error || !data) throw new Error("Could not load sections.");

  const ids = data.map((row: { id: string }) => row.id);
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= ids.length) return;

  [ids[index], ids[target]] = [ids[target], ids[index]];

  const { error: rpcError } = await supabase.rpc("reorder_sections", {
    ordered_ids: ids,
  });
  if (rpcError) throw new Error("Could not reorder sections.");

  refreshSite();
}

export async function setSectionVisibility(id: string, visible: boolean) {
  await requireAdmin();
  if (!UUID_RE.test(id) || typeof visible !== "boolean") return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .update({ is_visible: visible })
    .eq("id", id)
    .select("id");
  if (error || !data || data.length === 0)
    throw new Error("Could not update the section.");

  refreshSite();
}

export async function updateSection(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  if (!UUID_RE.test(id)) return fail("Invalid id.", formData);

  const title = readText(formData, "title");
  const body = readText(formData, "body");
  if (!title || title.length > 80)
    return fail("Title is required (max 80 characters).", formData);
  if (body.length > 2000)
    return fail("Text is too long (max 2,000 characters).", formData);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sections")
    .update({ title, body: body || null }) 
    .eq("id", id)
    .select("id");
  if (error) return fail(`Could not save: ${error.message}`, formData);
  if (!data || data.length === 0)
    return fail("Section not found, or you don't have permission.", formData);

  refreshSite();
  redirect("/admin/sections");
}