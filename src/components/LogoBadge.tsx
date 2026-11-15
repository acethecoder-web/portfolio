// src/components/LogoBadge.tsx
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

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        style={box}
        className="rounded-lg bg-white object-contain p-1.5"
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ ...box, backgroundColor: color }}
      className="flex items-center justify-center rounded-lg text-lg font-bold text-white"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}