import Link from "next/link";
import type { FormState } from "@/lib/validation";

export const inputClass =
  "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
    >
      {message}
    </p>
  );
}

export function FormActions({
  pending,
  label,
  cancelHref,
}: {
  pending: boolean;
  label: string;
  cancelHref?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-2 font-semibold text-accent-fg transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Saving…" : label}
      </button>
      {cancelHref && (
        <Link href={cancelHref} className="text-sm text-text-muted hover:text-accent">
          Cancel
        </Link>
      )}
    </div>
  );
}

// After a failed submit, show what the user typed; otherwise show saved values.
export function formValues(state: FormState) {
  const f = state?.fields;
  return {
    text: (name: string, fallback = "") => f?.[name] ?? fallback,
    checked: (name: string, fallback: boolean) => (f ? f[name] === "on" : fallback),
  };
}