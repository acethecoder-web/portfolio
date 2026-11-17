"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@/lib/data";
import { SOCIAL_FIELDS } from "@/lib/social";
import type { FormState } from "@/lib/validation";
import { Field, FormActions, FormError, formValues, inputClass } from "./fields";
import { ImageUploadField } from "./ImageUploadField";

export function SettingsForm({
  action,
  settings,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  settings: SiteSettings;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const { text } = formValues(state);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError message={state?.error} />

      <Field label="Site name" htmlFor="site_name" hint="Shown in the Hero, the header, and the browser tab.">
        <input id="site_name" name="site_name" required maxLength={80}
          defaultValue={text("site_name", settings.site_name)} className={inputClass} />
      </Field>

      <Field label="Tagline" htmlFor="tagline" hint="The line under your name in the Hero (max 200 characters).">
        <textarea id="tagline" name="tagline" rows={2} maxLength={200}
          defaultValue={text("tagline", settings.tagline)} className={inputClass} />
      </Field>
      
      <ImageUploadField
  name="avatar_url"
  label="Profile photo"
  folder="avatars"
  maxSize={800}
  defaultValue={text("avatar_url", settings.avatar_url ?? "")}
  hint="Shown next to your name in the Hero."
/>

      <Field label="Accent color" htmlFor="accent_color"
        hint="Buttons, links, and highlights. Light mode automatically uses a darker version. Default: #00ff41.">
        <input id="accent_color" name="accent_color" type="color"
          defaultValue={text("accent_color", settings.accent_color)}
          className="mt-1 h-10 w-20 cursor-pointer rounded-md border border-border bg-bg p-1" />
      </Field>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Social links</legend>
        {SOCIAL_FIELDS.map((f) => (
          <Field key={f.key} label={f.label} htmlFor={`social_${f.key}`}>
            <input
              id={`social_${f.key}`}
              name={`social_${f.key}`}
              type={f.key === "email" ? "email" : "url"}
              maxLength={200}
              defaultValue={text(`social_${f.key}`, settings.social_links?.[f.key] ?? "")}
              className={inputClass}
            />
          </Field>
        ))}
      </fieldset>

      <FormActions pending={pending} label="Save settings" />
    </form>
  );
}