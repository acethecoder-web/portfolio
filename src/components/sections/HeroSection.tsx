import type { SiteSettings } from "@/lib/data";

export function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="hero" className="pt-6 sm:pt-12">
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
        hello, world
      </span>
      <h1 className="gradient-text mt-5 text-5xl font-extrabold leading-tight tracking-tight sm:text-7xl">
        {settings.site_name}
         <span aria-hidden className="cursor-blink">_</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-text-muted">{settings.tagline}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-fg shadow-lg shadow-accent/25 transition hover:brightness-110"
        >
          View projects
        </a>
        <a
          href="#contact"
          className="rounded-md border border-border px-5 py-2.5 font-medium transition hover:border-accent hover:text-accent"
        >
          Contact me
        </a>
      </div>
    </section>
  );
}