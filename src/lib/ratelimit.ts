import "server-only";

const encoder = new TextEncoder();

export function clientIp(h: { get(name: string): string | null }): string {
  const real = h.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown"; // local development
}

export async function hashIp(ip: string): Promise<string> {
  const secret = process.env.RATE_LIMIT_KEY;
  if (!secret) throw new Error("RATE_LIMIT_KEY is not set.");

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(signature), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}