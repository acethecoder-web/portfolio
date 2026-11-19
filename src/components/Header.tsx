import Link from "next/link";
import { getSections , getSiteSettings   } from "@/lib/data";
import { slugify } from "@/lib/validation";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LABELS: Record<string, string> = {
  projects: "Projects",
  about: "About",
  contact: "Contact",
};

export async function Header() {
  const [sections, settings] = await Promise.all([getSections(), getSiteSettings()]);
  const links = sections.filter((s) => s.key in NAV_LABELS);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold text-accent">
        ~/{slugify(settings.site_name) || "home"}
      </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm text-text-muted">
          {links.map((s) => (
            <Link key={s.id} href={`/#${s.key}`} className="hover:text-accent">
              {NAV_LABELS[s.key]}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
