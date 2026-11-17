"use client";

import { useActionState } from "react";
import type { AdminTestimonial } from "@/lib/admin-data";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";
import { ImageUploadField } from "./ImageUploadField";

export function TestimonialForm({
  action,
  item,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item?: AdminTestimonial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { text, checked } = formValues(state);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />

      <Field label="Name" htmlFor="name">
        <input id="name" name="name" required maxLength={100}
          defaultValue={text("name", item?.name)} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Role" htmlFor="role">
          <input id="role" name="role" maxLength={100}
            defaultValue={text("role", item?.role ?? "")} className={inputClass} />
        </Field>
        <Field label="Company" htmlFor="company">
          <input id="company" name="company" maxLength={100}
            defaultValue={text("company", item?.company ?? "")} className={inputClass} />
        </Field>
      </div>

      <ImageUploadField
  name="company_logo_url"
  label="Company logo"
  folder="logos"
  maxSize={512}
  defaultValue={text("company_logo_url", item?.company_logo_url ?? "")}
  hint="Leave empty to show a letter badge."
/>

      <Field label="Quote" htmlFor="quote" hint="Max 1,000 characters.">
        <textarea id="quote" name="quote" required rows={5} maxLength={1000}
          defaultValue={text("quote", item?.quote)} className={inputClass} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Position" htmlFor="position" hint="Lower numbers appear first.">
          <input id="position" name="position" type="number" min={0} max={9999}
            defaultValue={text("position", String(item?.position ?? 0))} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 self-center text-sm">
          <input type="checkbox" name="is_visible"
            defaultChecked={checked("is_visible", item?.is_visible ?? true)} />
          Visible on the site
        </label>
      </div>

      <FormActions pending={pending} label={submitLabel} cancelHref="/admin/testimonials" />
    </form>
  );
}