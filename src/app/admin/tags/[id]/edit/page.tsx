import { notFound } from "next/navigation";
import { TagForm } from "@/components/admin/TagForm";
import { getAdminTag } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updateTag } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditTagPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminTag(id);
  if (!item || item.archived_at) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit tag</h1>
      <TagForm
        action={updateTag.bind(null, item.id)}
        item={item}
        submitLabel="Save changes"
        cancelHref="/admin/tags"
      />
    </div>
  );
}