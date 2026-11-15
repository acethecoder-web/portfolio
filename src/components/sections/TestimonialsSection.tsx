import { LogoBadge } from "@/components/LogoBadge";
import { colorFor } from "@/lib/colors";
import type { Section, Testimonial } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function TestimonialsSection({
  section,
  testimonials,
}: {
  section: Section;
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials">
      <SectionHeading title={section.title} eyebrow={section.key} />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {testimonials.map((t) => {
          const brand = t.company ?? t.name;
          const color = colorFor(brand);
          return (
            <figure
              key={t.id}
              className="relative overflow-hidden rounded-xl border border-border bg-bg-subtle p-5 pt-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center gap-3">
                <LogoBadge name={brand} src={t.company_logo_url} color={color} />
                <p className="font-semibold">{brand}</p>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.name}</span>
                {t.role && <span className="text-text-muted"> · {t.role}</span>}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}