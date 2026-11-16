import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/server";

async function countRows(table: string, unreadOnly = false) {
  const supabase = await createClient();
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (unreadOnly) query = query.eq("is_read", false);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [projects, testimonials, partners, unread] = await Promise.all([
    countRows("projects"),
    countRows("testimonials"),
    countRows("partners"),
    countRows("contact_messages", true),
  ]);

  const stats = [
    { label: "Projects (incl. drafts)", value: projects },
    { label: "Testimonials", value: testimonials },
    { label: "Partners", value: partners },
    { label: "Unread messages", value: unread },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">
        You&apos;re signed in. Management screens arrive in the next phases.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-bg-subtle p-4"
          >
            <p className="text-3xl font-bold text-accent">{s.value}</p>
            <p className="mt-1 text-sm text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}