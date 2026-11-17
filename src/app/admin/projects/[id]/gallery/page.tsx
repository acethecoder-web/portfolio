import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { GalleryAddForm } from "@/components/admin/GalleryAddForm";
import { ViewTabs } from "@/components/admin/ViewTabs";
import { CloudImage } from "@/components/CloudImage";
import { getAdminGallery, getAdminProject } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { isStorageUrl } from "@/lib/storage";
import {
  addGalleryImage,
  archiveGalleryImage,
  deleteGalleryImagePermanently,
  moveGalleryImage,
  restoreGalleryImage,
  updateGalleryCaption,
} from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
};

const arrowClass =
  "rounded-md border border-border px-2.5 py-1 text-sm hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-text";

export default async function AdminGalleryPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { view } = await searchParams;
  const archived = view === "archived";

  const project = await getAdminProject(id);
  if (!project) notFound();

  const images = await getAdminGallery(project.id, archived);
  const basePath = `/admin/projects/${project.id}/gallery`;

  return (
    <div>
      <Link href="/admin/projects" className="font-mono text-sm text-text-muted hover:text-accent">
        ← projects
      </Link>
      <h1 className="mt-3 text-2xl font-bold">Snapshots: {project.title}</h1>
      <p className="mt-1 text-sm text-text-muted">
        These appear on the project page, in this order.
      </p>

      {!archived && (
        <div className="mt-6 rounded-xl border border-border bg-bg-subtle p-5">
          <h2 className="mb-3 text-sm font-semibold">Add a snapshot</h2>
          {/* key = how many snapshots exist, so the form resets after each add */}
          <GalleryAddForm
            key={images.length}
            action={addGalleryImage.bind(null, project.id)}
          />
        </div>
      )}

      <ViewTabs basePath={basePath} archived={archived} />

      {images.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {archived ? "Nothing archived." : "No snapshots yet."}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {images.map((img, i) => (
            <li
              key={img.id}
              className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-bg-subtle p-4"
            >
              <div className="h-[100px] w-40 shrink-0 overflow-hidden rounded-md border border-border bg-bg">
                {isStorageUrl(img.image_url) && (
                  <CloudImage
                    src={img.image_url}
                    alt={`Snapshot ${i + 1}`}
                    width={160}
                    height={100}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>

              {archived ? (
                <>
                  <p className="min-w-40 flex-1 text-sm text-text-muted">
                    {img.alt_text ?? "No caption"}
                  </p>
                  <form action={restoreGalleryImage.bind(null, project.id, img.id)}>
                    <button type="submit" className="text-sm hover:text-accent">
                      Restore
                    </button>
                  </form>
                  <form action={deleteGalleryImagePermanently.bind(null, project.id, img.id)}>
                    <ConfirmButton
                      message="Permanently delete this snapshot? This cannot be undone."
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete permanently
                    </ConfirmButton>
                  </form>
                </>
              ) : (
                <>
                  <form
                    action={updateGalleryCaption.bind(null, project.id, img.id)}
                    className="flex min-w-48 flex-1 items-center gap-2"
                  >
                    <input
                      name="alt_text"
                      aria-label={`Caption for snapshot ${i + 1}`}
                      placeholder="Caption (optional)"
                      maxLength={200}
                      defaultValue={img.alt_text ?? ""}
                      className="w-full rounded-md border border-border bg-bg px-3 py-1.5 text-sm outline-none focus:border-accent"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent hover:text-accent"
                    >
                      Save
                    </button>
                  </form>

                  <div className="flex items-center gap-2">
                    <form action={moveGalleryImage.bind(null, project.id, img.id, "up")}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label={`Move snapshot ${i + 1} up`}
                        className={arrowClass}
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveGalleryImage.bind(null, project.id, img.id, "down")}>
                      <button
                        type="submit"
                        disabled={i === images.length - 1}
                        aria-label={`Move snapshot ${i + 1} down`}
                        className={arrowClass}
                      >
                        ↓
                      </button>
                    </form>
                  </div>

                  <form action={archiveGalleryImage.bind(null, project.id, img.id)}>
                    <ConfirmButton
                      message="Archive this snapshot? It will be hidden from the project page. You can restore it later."
                      className="text-sm text-text-muted hover:text-accent"
                    >
                      Archive
                    </ConfirmButton>
                  </form>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}