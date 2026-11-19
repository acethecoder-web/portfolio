import { getSiteSettings } from "@/lib/data";
import { renderOg } from "@/lib/og";
import { HEX_COLOR_RE } from "@/lib/validation";

export const alt = "Portfolio preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  let name = "Portfolio";
  let tagline = "";
  let accent = "#00ff41";
  try {
    const s = await getSiteSettings();
    name = s.site_name;
    tagline = s.tagline;
    if (HEX_COLOR_RE.test(s.accent_color)) accent = s.accent_color; // validated before use
  } catch {
    // keep defaults
  }
  return renderOg({
    eyebrow: "~/portfolio",
    title: name.slice(0, 40),
    subtitle: tagline.slice(0, 120),
    accent,
  });
}