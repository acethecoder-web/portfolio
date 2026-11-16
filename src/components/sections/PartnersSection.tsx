import type { Partner, Section } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function PartnersSection({
  section,
  partners,
}: {
  section: Section;
  partners: Partner[];
}) {
  if (partners.length === 0) return null;

  return (
    <section id="partners">
<SectionHeading title={section.title} intro={section.body} />      
<ul className="mt-4 flex flex-wrap gap-3">
        {partners.map((p) => (
          <li key={p.id}>
            {p.website_url ? (
              <a
                href={p.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-3 py-1.5 font-mono text-sm text-text-muted hover:text-text"
              >
                {p.name}
              </a>
            ) : (
              <span className="rounded-md border border-border px-3 py-1.5 font-mono text-sm text-text-muted">
                {p.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}