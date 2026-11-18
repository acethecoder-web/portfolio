import { LogoBadge } from "@/components/LogoBadge";
import { colorFor } from "@/lib/colors";
import type { Partner, Section } from "@/lib/data";
import { safeUrl } from "@/lib/url";
import { SectionHeading } from "./SectionHeading";

const cardClasses =
  "group flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-bg-subtle p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

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
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {partners.map((p) => {
          const color = colorFor(p.name);
          const href = safeUrl(p.website_url);
          const content = (
            <>
              <LogoBadge name={p.name} src={p.logo_url} color={color} size={56} />
              <span className="text-sm font-semibold transition-colors group-hover:text-accent">
                {p.name}
              </span>
              <span
                aria-hidden
                className="h-1 w-8 rounded-full transition-all duration-200 group-hover:w-14"
                style={{ backgroundColor: color }}
              />
            </>
          );
          return (
            <li key={p.id}>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClasses}
                >
                  {content}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <div className={cardClasses}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}