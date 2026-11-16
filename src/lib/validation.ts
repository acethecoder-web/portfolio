export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type FormState =
  | { error?: string; fields?: Record<string, string>; tagIds?: string[] }
  | undefined;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function fieldsFrom(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key !== "tag_ids" && !key.startsWith("$ACTION")) {
      out[key] = value;
    }
  }
  return out;
}

export const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function readText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function readPosition(formData: FormData): number | null {
  const n = Number.parseInt(readText(formData, "position") || "0", 10);
  return Number.isInteger(n) && n >= 0 && n <= 9999 ? n : null;
}

export function fail(error: string, formData: FormData): FormState {
  return {
    error,
    fields: fieldsFrom(formData),
    tagIds: formData.getAll("tag_ids").map(String),
  };
}