export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PREFIX = `https://res.cloudinary.com/${CLOUD}/image/upload/`;
const LEGACY_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/`;

const SAFE_REST = /^[A-Za-z0-9_\-/.,]+$/;
function safeRest(rest: string) {
  return SAFE_REST.test(rest) && !rest.includes("..");
}

export function isCloudinaryUrl(value: string | null | undefined): value is string {
  return (
    !!CLOUD &&
    !!value &&
    value.startsWith(CLOUDINARY_PREFIX) &&
    safeRest(value.slice(CLOUDINARY_PREFIX.length))
  );
}

export function isStorageUrl(value: string | null | undefined): value is string {
  if (isCloudinaryUrl(value)) return true;
  return !!value && value.startsWith(LEGACY_PREFIX) && safeRest(value.slice(LEGACY_PREFIX.length));
}