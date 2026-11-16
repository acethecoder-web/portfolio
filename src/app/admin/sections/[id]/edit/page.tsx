import { notFound, redirect } from "next/navigation";
import { SectionForm } from "@/components/admin/SectionForm";
import { getAdminSection } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updateSection } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditSectionPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  const item = await getAdminSection(id);
  if (!item) notFound();
  if (item.key === "hero") redirect("/admin/sections");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit section: {item.title}</h1>
      <SectionForm action={updateSection.bind(null, item.id)} item={item} />
    </div>
  );
}