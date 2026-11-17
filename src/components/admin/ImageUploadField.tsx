// src/components/admin/ImageUploadField.tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getUploadSignature } from "@/app/admin/uploads/actions";
import { MAX_IMAGE_BYTES, isStorageUrl } from "@/lib/storage";

const ACCEPT = ["image/png", "image/jpeg", "image/webp"];
const MAX_SOURCE_BYTES = 15 * 1024 * 1024;

async function processImage(file: File, maxSize: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process the image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string, quality?: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  let blob = await toBlob("image/webp", 0.85);
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/png");
  if (!blob) throw new Error("Could not process the image.");
  return blob;
}

async function uploadToCloudinary(blob: Blob, folder: string): Promise<string> {
  const sig = await getUploadSignature(folder);

  const form = new FormData();
  form.append("file", blob, `upload.${blob.type === "image/png" ? "png" : "webp"}`);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);
  form.append("public_id", sig.publicId);
  form.append("allowed_formats", sig.allowedFormats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed.");

  const url = json?.secure_url;
  if (!isStorageUrl(url)) throw new Error("Unexpected response from the image service.");
  return url;
}

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue = "",
  maxSize = 1600,
  hint,
}: {
  name: string;
  label: string;
  folder: "logos" | "covers" | "avatars" | "gallery";
  defaultValue?: string;
  maxSize?: number;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    inputRef.current?.setCustomValidity(busy ? "Please wait for the upload to finish." : "");
  }, [busy]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; 
    if (!file || busy) return;

    setError(null);
    if (!ACCEPT.includes(file.type)) {
      setError("Please choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError("That file is too large (max 15 MB).");
      return;
    }

    setBusy(true);
    try {
      const blob = await processImage(file, maxSize);
      if (blob.size > MAX_IMAGE_BYTES) {
        throw new Error("The image is still over 2 MB after resizing. Try a smaller one.");
      }
      setUrl(await uploadToCloudinary(blob, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={url}
            alt=""
            className="h-24 max-w-[60%] rounded-md border border-border bg-white object-contain p-1"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-sm text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}

      {url && !isStorageUrl(url) && (
        <p className="mt-1 text-xs text-red-500">
          This is an external link. Upload an image to replace it, or remove it.
        </p>
      )}

      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onPick}
        className="mt-2 block text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-border file:bg-bg-subtle file:px-3 file:py-1.5 file:text-sm file:text-text hover:file:border-accent"
      />

      {busy && (
        <p role="status" className="mt-1 text-xs text-text-muted">
          Uploading…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}