// src/components/admin/SectionForm.tsx
"use client";

import { useActionState } from "react";
import type { AdminSection } from "@/lib/admin-data";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";

export function SectionForm({
  action,
  item,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item: AdminSection;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { text } = formValues(state);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />

      <p className="font-mono text-xs text-text-muted">
        Section key: {item.key} (fixed)
      </p>

      <Field label="Title" htmlFor="title" hint="The heading shown above this section.">
        <input
          id="title"
          name="title"
          required
          maxLength={80}
          defaultValue={text("title", item.title)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Text"
        htmlFor="body"
        hint="Optional intro text shown under the heading. For the About section, this is your main text."
      >
        <textarea
          id="body"
          name="body"
          rows={7}
          maxLength={2000}
          defaultValue={text("body", item.body ?? "")}
          className={inputClass}
        />
      </Field>

      <FormActions pending={pending} label="Save changes" cancelHref="/admin/sections" />
    </form>
  );
}