"use server";

import { encryptField, fieldContext } from "@/lib/crypto";
import { createClient } from "@/lib/supabase/server";
import { CONTACT_EMAIL_RE, fail, readText, type FormState } from "@/lib/validation";

const GENERIC_ERROR = "Sorry, your message could not be sent right now. Please try again later.";

export async function sendMessage(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const message = readText(formData, "message");

  if (!name || name.length > 100)
    return fail("Please enter your name (max 100 characters).", formData);
  if (!email || email.length > 254 || !CONTACT_EMAIL_RE.test(email))
    return fail("Please enter a valid email address.", formData);
  if (!message || message.length > 5000)
    return fail("Please write a message (max 5,000 characters).", formData);

  const id = crypto.randomUUID(); 
  const ctx = (field: string) => fieldContext("contact_messages", id, field);

  try {
    const row = {
      id,
      name: await encryptField(name, ctx("name")),
      email: await encryptField(email, ctx("email")),
      message: await encryptField(message, ctx("message")),
    };

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert(row);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error("sendMessage failed:", err instanceof Error ? err.message : err);
    return { error: GENERIC_ERROR, fields: { name, email, message } };
  }

  return { success: true };
}