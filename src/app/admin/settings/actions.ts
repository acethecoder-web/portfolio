"use server";

import { redirect } from "next/navigation";
import { refreshSite } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { EMAIL_RE, SOCIAL_FIELDS } from "@/lib/social";
import { createClient } from "@/lib/supabase/server";
import {
  HEX_COLOR_RE,
  fail,
  isHttpUrl,
  readText,
  type FormState,
} from "@/lib/validation";
import { isStorageUrl } from "@/lib/storage";

export async function updateSettings(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const site_name = readText(formData, "site_name");
  const tagline = readText(formData, "tagline");
  const accent_color = readText(formData, "accent_color");
  const avatar_url = readText(formData, "avatar_url");

  if (!site_name || site_name.length > 80)
    return fail("Site name is required (max 80 characters).", formData);
  if (tagline.length > 200)
    return fail("Tagline is too long (max 200 characters).", formData);
  if (!HEX_COLOR_RE.test(accent_color))
    return fail("Pick a valid accent color.", formData);
  if (avatar_url && !isStorageUrl(avatar_url))
  return fail("Profile photo must be uploaded with the uploader.", formData);

  const social_links: Record<string, string> = {};
  for (const field of SOCIAL_FIELDS) {
    const value = readText(formData, `social_${field.key}`);
    if (!value) continue;
    if (value.length > 200) return fail(`${field.label} is too long.`, formData);
    if (field.key === "email") {
      if (!EMAIL_RE.test(value)) return fail("Enter a valid email address.", formData);
    } else if (!isHttpUrl(value)) {
      return fail(`${field.label} must be an http(s) link.`, formData);
    }
    social_links[field.key] = value;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
.update({ site_name, tagline, accent_color, avatar_url: avatar_url || null, social_links })    .eq("id", 1)
    .select("id");
  if (error) return fail(`Could not save: ${error.message}`, formData);
  if (!data || data.length === 0)
    return fail("Settings not found, or you don't have permission.", formData);

  refreshSite();
  redirect("/admin/settings?saved=1");
}