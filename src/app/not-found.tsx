import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-text-muted">
        That page doesn&apos;t exist, or it hasn&apos;t been published yet.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-fg hover:brightness-110"
      >
        Back home
      </Link>
    </Container>
  );
}