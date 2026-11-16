import Link from "next/link";
import { RowActions } from "@/components/admin/RowActions";
import { ViewTabs } from "@/components/admin/ViewTabs";
import { LogoBadge } from "@/components/LogoBadge";
import { getAdminTestimonials } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { colorFor } from "@/lib/colors";
import {
  archiveTestimonial,
  deleteTestimonialPermanently,
  restoreTestimonial,
} from "./actions";

type Props = { searchParams: Promise<{ view?: string }> };

export default async function AdminTestimonialsPage({ searchParams }: Props) {
  await requireAdmin();
  const { view } = await searchParams;
  const archived = view === "archived";
  const items = await getAdminTestimonials(archived);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:brightness-110"
        >
          New testimonial
        </Link>
      </div>
      <ViewTabs basePath="/admin/testimonials" archived={archived} />

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {archived ? "Nothing archived." : "No testimonials yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle font-mono text-xs text-text-muted">
              <tr>
                <th className="px-4 py-3">Testimonial</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => {
                const brand = t.company ?? t.name;
                return (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LogoBadge name={brand} src={t.company_logo_url} color={colorFor(brand)} size={36} />
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-xs text-text-muted">{t.company ?? "No company"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                      {archived
                        ? `archived ${t.archived_at ? new Date(t.archived_at).toLocaleDateString() : ""}`
                        : t.is_visible ? "Visible" : "Hidden"}
                    </td>
                    <td className="px-4 py-3">
                      <RowActions
                        archived={archived}
                        editHref={`/admin/testimonials/${t.id}/edit`}
                        itemName={t.name}
                        archive={archiveTestimonial.bind(null, t.id)}
                        restore={restoreTestimonial.bind(null, t.id)}
                        remove={deleteTestimonialPermanently.bind(null, t.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}