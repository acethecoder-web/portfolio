"use server";

import { redirect } from "next/navigation";
import { archiveRow, deleteArchivedRow, refreshSite, restoreRow } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  UUID_RE,
  fail,
  isHttpUrl,
  readPosition,
  readText,
  type FormState,
} from "@/lib/validation";
import { isStorageUrl } from "@/lib/storage";

function parse(formData: FormData) {
  const name = readText(formData, "name");
  const logo = readText(formData, "logo_url");
  const website = readText(formData, "website_url");
  const position = readPosition(formData);

  if (!name || name.length > 100) return { error: "Name is required (max 100 characters)." };
if (logo && !isStorageUrl(logo)) return { error: "Logo must be uploaded with the uploader." };  if (website && !isHttpUrl(website)) return { error: "Website must be an http(s) link." };
  if (position === null) return { error: "Position must be a whole number between 0 and 9999." };

  return {
    values: {
      name,
      logo_url: logo || null,
      website_url: website || null,
      is_visible: formData.get("is_visible") === "on",
      position,
    },
  };
}

export async function createPartner(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { error } = await supabase.from("partners").insert(parsed.values);
  if (error) return fail(`Could not save: ${error.message}`, formData);

  refreshSite();
  redirect("/admin/partners");
}

export async function updatePartner(
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
    .from("partners")
    .update(parsed.values)
    .eq("id", id)
    .is("archived_at", null)
    .select("id");
  if (error) return fail(`Could not save: ${error.message}`, formData);
  if (!data || data.length === 0)
    return fail("Not found, archived, or you don't have permission.", formData);

  refreshSite();
  redirect("/admin/partners");
}

export async function archivePartner(id: string) {
  await archiveRow("partners", id, { is_visible: false });
  refreshSite();
  redirect("/admin/partners");
}

export async function restorePartner(id: string) {
  await restoreRow("partners", id);
  refreshSite();
  redirect("/admin/partners");
}

export async function deletePartnerPermanently(id: string) {
  await deleteArchivedRow("partners", id);
  refreshSite();
  redirect("/admin/partners?view=archived");
}