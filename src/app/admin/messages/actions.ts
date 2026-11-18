"use server";

import { redirect } from "next/navigation";
import { archiveRow, deleteArchivedRow, refreshSite, restoreRow } from "@/lib/archive";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { UUID_RE } from "@/lib/validation";

export async function setMessageRead(id: string, read: boolean) {
  await requireAdmin();
  if (!UUID_RE.test(id) || typeof read !== "boolean") return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: read })
    .eq("id", id)
    .is("archived_at", null)
    .select("id");
  if (error || !data || data.length === 0)
    throw new Error("Could not update the message.");

  refreshSite();
}

export async function archiveMessage(id: string) {
  await archiveRow("contact_messages", id);
  refreshSite();
  redirect("/admin/messages");
}

export async function restoreMessage(id: string) {
  await restoreRow("contact_messages", id);
  refreshSite();
  redirect("/admin/messages");
}

export async function deleteMessagePermanently(id: string) {
  await deleteArchivedRow("contact_messages", id);
  refreshSite();
  redirect("/admin/messages?view=archived");
}