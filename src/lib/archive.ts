import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UUID_RE } from "@/lib/validation";

export type ArchivableTable =
  | "projects"
  | "testimonials"
  | "partners"
  | "tags"
  | "project_images"
  | "contact_messages";

export function refreshSite() {
  revalidatePath("/", "layout");
}

export async function archiveRow(
  table: ArchivableTable,
  id: string,
  alsoSet: Record<string, boolean> = {}
) {
  await requireAdmin();
  if (!UUID_RE.test(id)) throw new Error("Invalid id.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: new Date().toISOString(), ...alsoSet })
    .eq("id", id)
    .is("archived_at", null)
    .select("id");
  if (error || !data || data.length === 0) throw new Error("Could not archive.");
}

export async function restoreRow(table: ArchivableTable, id: string) {
  await requireAdmin();
  if (!UUID_RE.test(id)) throw new Error("Invalid id.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .update({ archived_at: null })
    .eq("id", id)
    .not("archived_at", "is", null)
    .select("id");
  if (error || !data || data.length === 0) throw new Error("Could not restore.");
}

export async function deleteArchivedRow(table: ArchivableTable, id: string) {
  await requireAdmin();
  if (!UUID_RE.test(id)) throw new Error("Invalid id.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .not("archived_at", "is", null) 
    .select("id");
  if (error || !data || data.length === 0)
    throw new Error("Could not delete. Archive it first.");
}