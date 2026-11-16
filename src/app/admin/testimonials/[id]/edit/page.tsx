import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getAdminTestimonial } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { updateTestimonial } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminTestimonial(id);
  if (!item || item.archived_at) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit testimonial</h1>
      <TestimonialForm
        action={updateTestimonial.bind(null, item.id)}
        item={item}
        submitLabel="Save changes"
      />
    </div>
  );
}