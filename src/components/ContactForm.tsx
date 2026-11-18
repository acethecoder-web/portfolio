"use client";

import { useActionState } from "react";
import { Field, FormError, formValues, inputClass } from "@/components/admin/fields";
import { sendMessage } from "@/app/(site)/contact/actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, undefined);
  const { text } = formValues(state);

  if (state?.success) {
    return (
      <p
        role="status"
        className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent"
      >
        Thanks! Your message was sent.
      </p>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <FormError message={state?.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="contact-name">
          <input
            id="contact-name"
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            defaultValue={text("name")}
            className={inputClass}
          />
        </Field>
        <Field label="Email" htmlFor="contact-email">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={text("email")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor="contact-message"
        hint="Your message is encrypted before it is stored."
      >
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          defaultValue={text("message")}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-2 font-semibold text-accent-fg transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}