import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <a href="#hero" className="gradient-text font-mono text-sm font-bold">
        ASH
        </a>
        <nav className="flex items-center gap-4 text-sm text-text-muted">
          <a href="#projects" className="hover:text-accent">Projects</a>
          <a href="#about" className="hover:text-accent">About</a>
          <a href="#contact" className="hover:text-accent">Contact</a>
          <ThemeToggle />
        </nav>
      </Container>
      <div aria-hidden className="gradient-bg h-0.5" />
    </header>
  );
}