"use server";

import { headers } from "next/headers";
import { encryptField, fieldContext } from "@/lib/crypto";
import { clientIp, hashIp } from "@/lib/ratelimit";
import { createClient } from "@/lib/supabase/server";
import { CONTACT_EMAIL_RE, fail, readText, type FormState } from "@/lib/validation";

const GENERIC_ERROR = "Sorry, your message could not be sent right now. Please try again later.";
const MIN_FILL_MS = 3000; // a person needs more than 3 seconds to fill in the form

export async function sendMessage(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  if (readText(formData, "website")) return { success: true };

  const startedAt = Number(readText(formData, "started_at"));
  if (
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    return fail("Please take a moment to review your message, then send it again.", formData);
  }

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

  let status: string | null = null;
  try {
    const secret = process.env.CONTACT_SUBMIT_SECRET;
    if (!secret) throw new Error("CONTACT_SUBMIT_SECRET is not set.");

    const ipHash = await hashIp(clientIp(await headers()));

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_contact_message", {
      p_secret: secret,
      p_ip_hash: ipHash,
      p_id: id,
      p_name: await encryptField(name, ctx("name")),
      p_email: await encryptField(email, ctx("email")),
      p_message: await encryptField(message, ctx("message")),
    });
    if (error) throw new Error(error.message);
    status = data as string | null;
  } catch (err) {
    console.error("sendMessage failed:", err instanceof Error ? err.message : err);
    return { error: GENERIC_ERROR, fields: { name, email, message } };
  }

  if (status === "limited") {
    return {
      error: "You've sent several messages recently. Please try again later.",
      fields: { name, email, message },
    };
  }
  if (status !== "ok") {
    console.error("sendMessage rejected by the database:", status);
    return { error: GENERIC_ERROR, fields: { name, email, message } };
  }

  return { success: true };
}