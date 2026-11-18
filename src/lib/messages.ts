import "server-only";
import { decryptField, fieldContext } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/server";

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  archived_at: string | null;
  readable: boolean;
};

type RawMessage = Omit<AdminMessage, "readable">;

export async function getAdminMessages(archived = false): Promise<AdminMessage[]> {
  const supabase = await createClient();
  let query = supabase
    .from("contact_messages")
    .select("id, name, email, message, is_read, created_at, archived_at");

  query = archived
    ? query.not("archived_at", "is", null)
    : query.is("archived_at", null);

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`contact_messages: ${error.message}`);

  const rows = (data ?? []) as unknown as RawMessage[];
  return Promise.all(
    rows.map(async (row): Promise<AdminMessage> => {
      const ctx = (field: string) => fieldContext("contact_messages", row.id, field);
      try {
        const [name, email, message] = await Promise.all([
          decryptField(row.name, ctx("name")),
          decryptField(row.email, ctx("email")),
          decryptField(row.message, ctx("message")),
        ]);
        return { ...row, name, email, message, readable: true };
      } catch {
        return { ...row, name: "", email: "", message: "", readable: false };
      }
    })
  );
}