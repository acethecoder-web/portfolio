import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { logout } from "@/app/login/actions";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { email } = await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-bg-subtle">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="font-mono text-sm font-bold text-accent">ASH</span>
            <Link href="/admin" className="text-sm hover:text-accent">
              Dashboard
            </Link>
            <Link href="/admin/sections" className="text-sm hover:text-accent">Sections</Link>
            <Link href="/admin/projects" className="text-sm hover:text-accent">
            Projects
            </Link>
            <Link href="/admin/testimonials" className="text-sm hover:text-accent">Testimonials</Link>
            <Link href="/admin/partners" className="text-sm hover:text-accent">Partners</Link>
            <Link href="/admin/tags" className="text-sm hover:text-accent">Tags</Link>
            <Link href="/admin/messages" className="text-sm hover:text-accent">Messages</Link>
            <Link href="/admin/settings" className="text-sm hover:text-accent">Settings</Link>
            <Link href="/" className="text-sm text-text-muted hover:text-accent">
              View site ↗
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs text-text-muted sm:inline">
              {email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-border px-3 py-1 text-xs text-text-muted hover:border-accent hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </Container>
      </header>
      <Container className="py-8">{children}</Container>
    </div>
  );
}