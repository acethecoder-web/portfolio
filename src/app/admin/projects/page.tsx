import Link from "next/link";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { getAdminProjects } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import {
  archiveProject,
  deleteProjectPermanently,
  restoreProject,
} from "./actions";

type Props = { searchParams: Promise<{ view?: string }> };

export default async function AdminProjectsPage({ searchParams }: Props) {
  await requireAdmin();
  const { view } = await searchParams;
  const showArchived = view === "archived";
  const projects = await getAdminProjects(showArchived);

  const tabClass = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm ${
      active ? "bg-bg-subtle font-semibold text-accent" : "text-text-muted hover:text-accent"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:brightness-110"
        >
          New project
        </Link>
      </div>

      <div className="mt-4 flex gap-2 border-b border-border pb-2">
        <Link href="/admin/projects" className={tabClass(!showArchived)}>
          Active
        </Link>
        <Link href="/admin/projects?view=archived" className={tabClass(showArchived)}>
          Archived
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {showArchived ? "Nothing archived." : "No projects yet. Create your first one."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-subtle font-mono text-xs text-text-muted">
              <tr>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{p.title}</p>
                    <p className="font-mono text-xs text-text-muted">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {showArchived ? (
                      <span className="font-mono text-[11px] text-text-muted">
                        archived{" "}
                        {p.archived_at && new Date(p.archived_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                            p.is_published
                              ? "border-accent/40 text-accent"
                              : "border-border text-text-muted"
                          }`}
                        >
                          {p.is_published ? "Published" : "Draft"}
                        </span>
                        {p.is_featured && (
                          <span className="ml-2 font-mono text-[11px] text-text-muted">pinned</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      {showArchived ? (
                        <>
                          <form action={restoreProject.bind(null, p.id)}>
                            <button type="submit" className="hover:text-accent">
                              Restore
                            </button>
                          </form>
                          <form action={deleteProjectPermanently.bind(null, p.id)}>
                            <ConfirmButton
                              message={`Permanently delete "${p.title}"? This cannot be undone.`}
                              className="text-red-500 hover:underline"
                            >
                              Delete permanently
                            </ConfirmButton>
                          </form>
                        </>
                      ) : (
                        <>
                          {p.is_published && (
                            <Link href={`/projects/${p.slug}`} className="text-text-muted hover:text-accent">
                              View
                            </Link>
                          )}
                          <Link href={`/admin/projects/${p.id}/edit`} className="hover:text-accent">
                            Edit
                          </Link>
                          <Link href={`/admin/projects/${p.id}/gallery`} className="hover:text-accent">
  Snapshots
</Link>
                          <form action={archiveProject.bind(null, p.id)}>
                            <ConfirmButton
                              message={`Archive "${p.title}"? It will be hidden from your site. You can restore it later.`}
                              className="text-text-muted hover:text-accent"
                            >
                              Archive
                            </ConfirmButton>
                          </form>
                        </>
                      )}
                    </div>
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