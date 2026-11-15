// src/lib/colors.ts
const PALETTE = [
  "#00ff41", "#2dd4bf", "#a3e635", "#22d3ee",
  "#34d399", "#84cc16", "#10b981", "#4ade80",
];

// Same text always gives the same color (no randomness, no flicker)
export function colorFor(text: string): string {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}