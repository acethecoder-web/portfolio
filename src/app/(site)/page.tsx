import { Container } from "@/components/Container";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import {
  getPartners,
  getProjects,
  getSections,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data";

export default async function Home() {
  const [settings, sections, projects, testimonials, partners] =
    await Promise.all([
      getSiteSettings(),
      getSections(),
      getProjects(),
      getTestimonials(),
      getPartners(),
    ]);

  return (
    <Container className="space-y-14 py-10">
      {sections.map((section) => {
        switch (section.key) {
          case "hero":
            return <HeroSection key={section.id} settings={settings} />;
          case "projects":
            return (
              <ProjectsSection key={section.id} section={section} projects={projects} />
            );
          case "about":
            return <AboutSection key={section.id} section={section} settings={settings} />;
          case "testimonials":
            return (
              <TestimonialsSection key={section.id} section={section} testimonials={testimonials} />
            );
          case "partners":
            return <PartnersSection key={section.id} section={section} partners={partners} />;
          case "contact":
            return <ContactSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </Container>
  );
}