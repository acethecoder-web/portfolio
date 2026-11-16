import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
      <Link href="/" className="font-mono text-sm font-bold text-accent">
  ASH
</Link>
<nav className="flex items-center gap-4 text-sm text-text-muted">
  <Link href="/#projects" className="hover:text-accent">Projects</Link>
  <Link href="/#about" className="hover:text-accent">About</Link>
  <Link href="/#contact" className="hover:text-accent">Contact</Link>
  <ThemeToggle />
</nav>
      </Container>
      <div aria-hidden className="gradient-bg h-0.5" />
    </header>
  );
}