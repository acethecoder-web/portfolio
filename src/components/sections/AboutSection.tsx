import type { Section, SiteSettings } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function AboutSection({
  section,
  settings,
}: {
  section: Section;
  settings: SiteSettings;
}) {
  return (
    <section id="about">
      <SectionHeading title={section.title} />
      <div className="mt-6 rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
        <p className="max-w-2xl whitespace-pre-line leading-relaxed">
          {settings.bio}
        </p>
      </div>
    </section>
  );
}