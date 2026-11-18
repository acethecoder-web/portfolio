import "server-only";

const VERSION_RE = /^v\d{1,3}$/;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const keyCache = new Map<string, CryptoKey>();

function toBase64Url(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string) {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function getKey(version: string): Promise<CryptoKey> {
  if (!VERSION_RE.test(version)) throw new Error("Invalid key version.");

  const cached = keyCache.get(version);
  if (cached) return cached;

  const encoded = process.env[`MESSAGE_KEY_${version.toUpperCase()}`];
  if (!encoded) throw new Error(`Missing encryption key for version ${version}.`);

  const raw = fromBase64Url(encoded.trim());
  if (raw.length !== 32)
    throw new Error("The encryption key must be exactly 32 bytes (256 bits).");

  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false, 
    ["encrypt", "decrypt"]
  );
  keyCache.set(version, key);
  return key;
}

export function fieldContext(table: string, id: string, field: string): string {
  return `${table}|${id}|${field}`;
}

export async function encryptField(plaintext: string, context: string): Promise<string> {
  const version = process.env.MESSAGE_KEY_CURRENT ?? "v1";
  const key = await getKey(version);

  const iv = crypto.getRandomValues(new Uint8Array(12)); 
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(context) },
    key,
    encoder.encode(plaintext)
  );

  return `${version}.${toBase64Url(iv)}.${toBase64Url(ciphertext)}`;
}

export async function decryptField(payload: string, context: string): Promise<string> {
  const parts = payload.split(".");
  if (parts.length !== 3 || !VERSION_RE.test(parts[0]))
    throw new Error("Malformed ciphertext.");

  const [version, ivPart, dataPart] = parts;
  const key = await getKey(version);

  const iv = fromBase64Url(ivPart);
  if (iv.length !== 12) throw new Error("Malformed ciphertext.");

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: encoder.encode(context) },
      key,
      fromBase64Url(dataPart)
    );
    return decoder.decode(plaintext);
  } catch {
    throw new Error("Could not decrypt (wrong key, wrong context, or tampered data).");
  }
}