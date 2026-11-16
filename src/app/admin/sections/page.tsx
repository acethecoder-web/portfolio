import Link from "next/link";
import { getAdminSections } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { moveSection, setSectionVisibility } from "./actions";

const arrowClass =
  "rounded-md border border-border px-2.5 py-1 text-sm hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text";

export default async function AdminSectionsPage() {
  await requireAdmin();
  const sections = await getAdminSections();

  return (
    <div>
      <h1 className="text-2xl font-bold">Sections</h1>
      <p className="mt-1 text-sm text-text-muted">
        The order here is the order on your homepage. Hidden sections are not
        shown to visitors.
      </p>

      <ol className="mt-6 space-y-3">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-bg-subtle p-4"
          >
            <span className="w-6 font-mono text-sm text-text-muted">{i + 1}</span>

            <div className="min-w-40 flex-1">
              <p className="font-semibold">{s.title}</p>
              <p className="font-mono text-xs text-text-muted">{s.key}</p>
            </div>

            <div className="flex items-center gap-2">
              <form action={moveSection.bind(null, s.id, "up")}>
                <button
                  type="submit"
                  disabled={i === 0}
                  aria-label={`Move ${s.title} up`}
                  className={arrowClass}
                >
                  ↑
                </button>
              </form>
              <form action={moveSection.bind(null, s.id, "down")}>
                <button
                  type="submit"
                  disabled={i === sections.length - 1}
                  aria-label={`Move ${s.title} down`}
                  className={arrowClass}
                >
                  ↓
                </button>
              </form>
            </div>

            <form action={setSectionVisibility.bind(null, s.id, !s.is_visible)}>
              <button
                type="submit"
                aria-label={`${s.is_visible ? "Hide" : "Show"} ${s.title}`}
                className={`rounded-full border px-3 py-1 font-mono text-xs ${
                  s.is_visible
                    ? "border-accent/40 text-accent"
                    : "border-border text-text-muted"
                }`}
              >
                {s.is_visible ? "Visible" : "Hidden"}
              </button>
            </form>

            <div className="w-28 text-right text-sm">
              {s.key === "hero" ? (
                <span className="text-xs text-text-muted">Edit in Site settings</span>
              ) : (
                <Link href={`/admin/sections/${s.id}/edit`} className="hover:text-accent">
                  Edit text
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}