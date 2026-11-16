import Link from "next/link";
import { RowActions } from "@/components/admin/RowActions";
import { ViewTabs } from "@/components/admin/ViewTabs";
import { LogoBadge } from "@/components/LogoBadge";
import { getAdminPartners } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { colorFor } from "@/lib/colors";
import { archivePartner, deletePartnerPermanently, restorePartner } from "./actions";

type Props = { searchParams: Promise<{ view?: string }> };

export default async function AdminPartnersPage({ searchParams }: Props) {
  await requireAdmin();
  const { view } = await searchParams;
  const archived = view === "archived";
  const items = await getAdminPartners(archived);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:brightness-110"
        >
          New partner
        </Link>
      </div>
      <ViewTabs basePath="/admin/partners" archived={archived} />

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {archived ? "Nothing archived." : "No partners yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle font-mono text-xs text-text-muted">
              <tr>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <LogoBadge name={p.name} src={p.logo_url} color={colorFor(p.name)} size={36} />
                      <p className="font-semibold">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                    {archived
                      ? `archived ${p.archived_at ? new Date(p.archived_at).toLocaleDateString() : ""}`
                      : p.is_visible ? "Visible" : "Hidden"}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      archived={archived}
                      editHref={`/admin/partners/${p.id}/edit`}
                      itemName={p.name}
                      archive={archivePartner.bind(null, p.id)}
                      restore={restorePartner.bind(null, p.id)}
                      remove={deletePartnerPermanently.bind(null, p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}