import { PartnerForm } from "@/components/admin/PartnerForm";
import { requireAdmin } from "@/lib/auth";
import { createPartner } from "../actions";

export default async function NewPartnerPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New partner</h1>
      <PartnerForm action={createPartner} submitLabel="Create partner" />
    </div>
  );
}