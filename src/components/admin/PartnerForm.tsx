"use client";

import { useActionState } from "react";
import type { AdminPartner } from "@/lib/admin-data";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";
import { ImageUploadField } from "./ImageUploadField";

export function PartnerForm({
  action,
  item,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item?: AdminPartner;
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

        <ImageUploadField
          name="logo_url"
          label="Logo"
          folder="logos"
          maxSize={512}
          defaultValue={text("logo_url", item?.logo_url ?? "")}
          hint="Leave empty to show a letter badge."
        />

      <Field label="Website URL" htmlFor="website_url">
        <input id="website_url" name="website_url" type="url"
          defaultValue={text("website_url", item?.website_url ?? "")} className={inputClass} />
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

      <FormActions pending={pending} label={submitLabel} cancelHref="/admin/partners" />
    </form>
  );
}