import { ContactForm } from "@/components/ContactForm";
import type { Section } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";

export function ContactSection({ section }: { section: Section }) {
  return (
    <section id="contact">
      <SectionHeading title={section.title} />
      <div className="mt-6 rounded-xl border border-border bg-bg-subtle p-6 sm:p-8">
        <p className="max-w-md text-text-muted">
          {section.body ?? "Have a project in mind? Let's talk."}
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}