import { getSiteSettings } from "@/lib/data";
import { SOCIAL_FIELDS, socialHref } from "@/lib/social";
import { Container } from "./Container";

export async function Footer() {
  const settings = await getSiteSettings();
  const links = SOCIAL_FIELDS.flatMap((f) => {
    const href = socialHref(f.key, settings.social_links?.[f.key]);
    return href ? [{ label: f.label, href, external: f.key !== "email" }] : [];
  });

  return (
    <footer className="mt-20 border-t border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-text-muted">
        <p>
          © {new Date().getFullYear()} {settings.site_name}
        </p>
        {links.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="hover:text-accent"
                  {...(l.external && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}