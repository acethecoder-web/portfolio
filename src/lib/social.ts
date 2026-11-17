import { safeUrl } from "@/lib/url";

export const SOCIAL_FIELDS = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "website", label: "Website" },
  { key: "email", label: "Email" },
] as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function socialHref(key: string, value: string | undefined): string | null {
  if (!value) return null;
  if (key === "email") return EMAIL_RE.test(value) ? `mailto:${value}` : null;
  return safeUrl(value);
}