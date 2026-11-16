"use client";

import { useActionState } from "react";
import type { AdminTagFull } from "@/lib/admin-data";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";

export function TagForm({
  action,
  item,
  submitLabel,
  cancelHref,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item?: AdminTagFull;
  submitLabel: string;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { text } = formValues(state);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormError message={state?.error} />
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1">
          <Field label="Name" htmlFor="name">
            <input id="name" name="name" required maxLength={40}
              defaultValue={text("name", item?.name)} className={inputClass} />
          </Field>
        </div>
        <Field label="Color" htmlFor="color">
          <input id="color" name="color" type="color"
            defaultValue={text("color", item?.color ?? "#8b949e")}
            className="mt-1 h-10 w-16 cursor-pointer rounded-md border border-border bg-bg p-1" />
        </Field>
      </div>
      <FormActions pending={pending} label={submitLabel} cancelHref={cancelHref} />
    </form>
  );
}