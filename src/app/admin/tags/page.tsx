import { RowActions } from "@/components/admin/RowActions";
import { TagForm } from "@/components/admin/TagForm";
import { ViewTabs } from "@/components/admin/ViewTabs";
import { getAdminTags } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { archiveTag, createTag, deleteTagPermanently, restoreTag } from "./actions";

type Props = { searchParams: Promise<{ view?: string }> };

export default async function AdminTagsPage({ searchParams }: Props) {
  await requireAdmin();
  const { view } = await searchParams;
  const archived = view === "archived";
  const tags = await getAdminTags(archived);

  return (
    <div>
      <h1 className="text-2xl font-bold">Tags</h1>

      {!archived && (
        <div className="mt-6 rounded-xl border border-border bg-bg-subtle p-5">
          <h2 className="mb-3 text-sm font-semibold">Add a tag</h2>
          <TagForm action={createTag} submitLabel="Add tag" />
        </div>
      )}

      <ViewTabs basePath="/admin/tags" archived={archived} />

      {tags.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {archived ? "Nothing archived." : "No tags yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <tbody>
              {tags.map((t) => (
                <tr key={t.id} className="border-t border-border first:border-t-0">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 font-mono text-sm">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RowActions
                      archived={archived}
                      editHref={`/admin/tags/${t.id}/edit`}
                      itemName={t.name}
                      deleteNote="It will also be removed from every project. "
                      archive={archiveTag.bind(null, t.id)}
                      restore={restoreTag.bind(null, t.id)}
                      remove={deleteTagPermanently.bind(null, t.id)}
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