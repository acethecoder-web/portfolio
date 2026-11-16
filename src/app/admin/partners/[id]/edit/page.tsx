import { notFound } from "next/navigation";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { getAdminPartner } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updatePartner } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditPartnerPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminPartner(id);
  if (!item || item.archived_at) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit partner</h1>
      <PartnerForm
        action={updatePartner.bind(null, item.id)}
        item={item}
        submitLabel="Save changes"
      />
    </div>
  );
}