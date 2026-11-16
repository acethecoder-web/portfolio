import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/auth";
import { createTestimonial } from "../actions";

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New testimonial</h1>
      <TestimonialForm action={createTestimonial} submitLabel="Create testimonial" />
    </div>
  );
}