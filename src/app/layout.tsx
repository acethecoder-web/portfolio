// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";
import { accentCss } from "@/lib/theme";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let name = "Your Name";
  let tagline = "Portfolio";
  try {
    const s = await getSiteSettings();
    name = s.site_name;
    tagline = s.tagline;
  } catch {
  }
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${name} | Portfolio`, template: `%s | ${name}` },
    description: tagline,
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} | Portfolio`,
      description: tagline,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image" },
  };
}

const themeScript = `
  try {
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.dataset.theme = "light";
    }
  } catch (e) {}
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let css = "";
  try {
    css = accentCss((await getSiteSettings()).accent_color);
  } catch {
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {css && <style>{css}</style>}
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}