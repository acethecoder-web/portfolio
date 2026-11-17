// src/components/LogoBadge.tsx
import { CloudImage } from "@/components/CloudImage";
import { isStorageUrl } from "@/lib/storage";

export function LogoBadge({
  name,
  src,
  color,
  size = 44,
}: {
  name: string;
  src?: string | null;
  color: string;
  size?: number;
}) {
  const box = { width: size, height: size };

  if (isStorageUrl(src)) {
    return (
      <CloudImage
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={box}
        className="rounded-lg bg-white object-contain p-1.5"
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ ...box, backgroundColor: color }}
      className="flex items-center justify-center rounded-lg text-lg font-bold text-black"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}