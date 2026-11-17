"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";
import { ImageUploadField } from "./ImageUploadField";

export function GalleryAddForm({
  action,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { text } = formValues(state);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormError message={state?.error} />

      <ImageUploadField
        name="image_url"
        label="Snapshot"
        folder="gallery"
        maxSize={1600}
        hint="PNG, JPEG, or WebP. A screenshot of the project."
      />

      <Field
        label="Caption (optional)"
        htmlFor="alt_text"
        hint="Shown under the snapshot (max 200 characters)."
      >
        <input
          id="alt_text"
          name="alt_text"
          maxLength={200}
          defaultValue={text("alt_text")}
          className={inputClass}
        />
      </Field>

      <FormActions pending={pending} label="Add snapshot" />
    </form>
  );
}