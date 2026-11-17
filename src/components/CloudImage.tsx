"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { isCloudinaryUrl } from "@/lib/storage";

// Asks Cloudinary for the right size and best format:
// f_auto = best format (WebP/AVIF), q_auto = smart quality,
// w_N = the width needed, c_limit = never enlarge.
function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const q = quality ? `q_${quality}` : "q_auto";
  return src.replace("/image/upload/", `/image/upload/f_auto,${q},w_${width},c_limit/`);
}

export function CloudImage(props: ImageProps) {
  const loader =
    typeof props.src === "string" && isCloudinaryUrl(props.src)
      ? cloudinaryLoader
      : undefined; // older Supabase images use Next.js's normal optimizer

  return <Image {...props} loader={loader} />;
}