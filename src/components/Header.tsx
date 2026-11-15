import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border bg-bg-subtle">
      <Container className="flex h-14 items-center justify-between">
        <span className="font-mono text-sm font-semibold">ASH</span>
        <nav className="flex items-center gap-4 text-sm text-text-muted">
          <a href="#projects" className="hover:text-text">Projects</a>
          <a href="#about" className="hover:text-text">About</a>
          <a href="#contact" className="hover:text-text">Contact</a>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}