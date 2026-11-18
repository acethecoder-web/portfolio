// src/lib/storage.ts
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PREFIX = `https://res.cloudinary.com/${CLOUD}/image/upload/`;
const LEGACY_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/`;


const SAFE_REST = /^[A-Za-z0-9_\-/.,]+$/;
function safeRest(rest: string) {
  return SAFE_REST.test(rest) && !rest.includes("..");
}

function hasPrefix(value: string | null | undefined, prefix: string): boolean {
  return !!value && value.startsWith(prefix) && safeRest(value.slice(prefix.length));
}

export function isCloudinaryUrl(value: string | null | undefined): boolean {
  return !!CLOUD && hasPrefix(value, CLOUDINARY_PREFIX);
}

export function isStorageUrl(value: string | null | undefined): value is string {
  return isCloudinaryUrl(value) || hasPrefix(value, LEGACY_PREFIX);
}