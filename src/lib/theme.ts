import { HEX_COLOR_RE } from "@/lib/validation";

function luminance([r, g, b]: number[]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function readableOn(rgb: number[]): string {
  return luminance(rgb) > 0.3 ? "#00140a" : "#ffffff";
}

export function accentCss(hex: string | null | undefined): string {
  if (!hex || !HEX_COLOR_RE.test(hex)) return ""; 

  const rgb = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  const lightRgb = rgb.map((c) => Math.round(c * 0.45)); 

  return (
    `html:root{--accent:${hex};--accent-fg:${readableOn(rgb)};}` +
    `html:root[data-theme="light"]{--accent:color-mix(in srgb,${hex} 45%,black);--accent-fg:${readableOn(lightRgb)};}`
  );
}