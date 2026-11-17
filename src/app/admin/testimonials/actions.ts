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
  const role = readText(formData, "role");
  const company = readText(formData, "company");
  const logo = readText(formData, "company_logo_url");
  const quote = readText(formData, "quote");
  const position = readPosition(formData);

  if (!name || name.length > 100) return { error: "Name is required (max 100 characters)." };
  if (role.length > 100) return { error: "Role is too long (max 100 characters)." };
  if (company.length > 100) return { error: "Company is too long (max 100 characters)." };
  if (!quote || quote.length > 1000) return { error: "Quote is required (max 1,000 characters)." };
  if (logo && !isStorageUrl(logo)) return { error: "Logo must be uploaded with the uploader." };
  if (position === null) return { error: "Position must be a whole number between 0 and 9999." };

  return {
    values: {
      name,
      role: role || null,
      company: company || null,
      company_logo_url: logo || null,
      quote,
      is_visible: formData.get("is_visible") === "on",
      position,
    },
  };
}

export async function createTestimonial(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if ("error" in parsed) return fail(parsed.error ?? "Invalid input.", formData);

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(parsed.values);
  if (error) return fail(`Could not save: ${error.message}`, formData);

  refreshSite();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
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
    .from("testimonials")
    .update(parsed.values)
    .eq("id", id)
    .is("archived_at", null)
    .select("id");
  if (error) return fail(`Could not save: ${error.message}`, formData);
  if (!data || data.length === 0)
    return fail("Not found, archived, or you don't have permission.", formData);

  refreshSite();
  redirect("/admin/testimonials");
}

export async function archiveTestimonial(id: string) {
  await archiveRow("testimonials", id, { is_visible: false });
  refreshSite();
  redirect("/admin/testimonials");
}

export async function restoreTestimonial(id: string) {
  await restoreRow("testimonials", id);
  refreshSite();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialPermanently(id: string) {
  await deleteArchivedRow("testimonials", id);
  refreshSite();
  redirect("/admin/testimonials?view=archived");
}