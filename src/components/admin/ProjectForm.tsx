"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AdminProject, AdminTag } from "@/lib/admin-data";
import type { FormState } from "@/lib/validation";

const inputClass =
  "mt-1 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent";

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function ProjectForm({
  action,
  project,
  tags,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: AdminProject;
  tags: AdminTag[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  // After a failed submit, show what the user typed; otherwise show saved values.
  const f = state?.fields;
  const text = (name: string, fallback = "") => f?.[name] ?? fallback;
  const checked = (name: string, fallback: boolean) =>
    f ? f[name] === "on" : fallback;
  const selectedTags = state?.tagIds ?? project?.tag_ids ?? [];

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state?.error && (
        <p
          role="alert"
          className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-500"
        >
          {state.error}
        </p>
      )}

      <Field label="Title" htmlFor="title">
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          defaultValue={text("title", project?.title)}
          className={inputClass}
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        hint="The URL part: /projects/your-slug. Leave blank to generate it from the title."
      >
        <input
          id="slug"
          name="slug"
          maxLength={80}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={text("slug", project?.slug)}
          className={`${inputClass} font-mono`}
        />
      </Field>

      <Field label="Short description" htmlFor="description" hint="Shown on the project card (max 300 characters).">
        <textarea
          id="description"
          name="description"
          required
          rows={2}
          maxLength={300}
          defaultValue={text("description", project?.description)}
          className={inputClass}
        />
      </Field>

      <Field label="README (markdown)" htmlFor="content" hint="Shown on the project page. Headings, lists, tables, and code blocks are supported.">
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={text("content", project?.content ?? "")}
          className={`${inputClass} font-mono`}
        />
      </Field>

      <Field label="Cover image URL" htmlFor="cover_image_url" hint="Paste an https image link for now. Uploads arrive in Phase 10.">
        <input
          id="cover_image_url"
          name="cover_image_url"
          type="url"
          defaultValue={text("cover_image_url", project?.cover_image_url ?? "")}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Source code URL" htmlFor="repo_url">
          <input
            id="repo_url"
            name="repo_url"
            type="url"
            defaultValue={text("repo_url", project?.repo_url ?? "")}
            className={inputClass}
          />
        </Field>
        <Field label="Live demo URL" htmlFor="live_url">
          <input
            id="live_url"
            name="live_url"
            type="url"
            defaultValue={text("live_url", project?.live_url ?? "")}
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Tags</legend>
        {tags.length === 0 ? (
          <p className="mt-1 text-xs text-text-muted">No tags yet.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="tag_ids"
                  value={tag.id}
                  defaultChecked={selectedTags.includes(tag.id)}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Position" htmlFor="position" hint="Lower numbers appear first.">
          <input
            id="position"
            name="position"
            type="number"
            min={0}
            max={9999}
            defaultValue={text("position", String(project?.position ?? 0))}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 self-center text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={checked("is_published", project?.is_published ?? false)}
          />
          Published
        </label>
        <label className="flex items-center gap-2 self-center text-sm">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={checked("is_featured", project?.is_featured ?? false)}
          />
          Pinned (featured)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2 font-semibold text-accent-fg transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin/projects" className="text-sm text-text-muted hover:text-accent">
          Cancel
        </Link>
      </div>
    </form>
  );
}