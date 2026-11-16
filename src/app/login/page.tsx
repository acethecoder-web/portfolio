import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-bg-subtle p-6">
        <p className="font-mono text-sm text-accent">ASH</p>
        <h1 className="mt-1 text-2xl font-bold">Sign in</h1>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
          >
            Invalid email or password.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-accent-fg transition hover:brightness-110"
          >
            Sign in
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 inline-block font-mono text-xs text-text-muted hover:text-accent"
        >
          ← back to site
        </Link>
      </div>
    </main>
  );
}