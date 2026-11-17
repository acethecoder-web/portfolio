"use server";

import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/auth";

const FOLDERS = ["logos", "covers", "avatars", "gallery"];

export async function getUploadSignature(folder: string) {
  await requireAdmin(); 
  if (!FOLDERS.includes(folder)) throw new Error("Invalid folder.");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret)
    throw new Error("The image service is not configured.");

  // The SERVER decides these. The signature locks them in.
  const params = {
    timestamp: Math.round(Date.now() / 1000),
    folder: `portfolio/${folder}`,
    public_id: crypto.randomUUID(), // random name; the original file name is never used
    allowed_formats: "webp,png",
  };
  const signature = cloudinary.utils.api_sign_request(params, apiSecret);

  return {
    signature,
    timestamp: params.timestamp,
    folder: params.folder,
    publicId: params.public_id,
    allowedFormats: params.allowed_formats,
    apiKey,
    cloudName,
  };
}