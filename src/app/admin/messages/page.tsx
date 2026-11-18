import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ViewTabs } from "@/components/admin/ViewTabs";
import { requireAdmin } from "@/lib/auth";
import { getAdminMessages } from "@/lib/messages";
import { CONTACT_EMAIL_RE } from "@/lib/validation";
import {
  archiveMessage,
  deleteMessagePermanently,
  restoreMessage,
  setMessageRead,
} from "./actions";

type Props = { searchParams: Promise<{ view?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  await requireAdmin();
  const { view } = await searchParams;
  const archived = view === "archived";
  const messages = await getAdminMessages(archived);

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-text-muted">
        Messages are encrypted in the database and decrypted here, for you only.
      </p>
      <ViewTabs basePath="/admin/messages" archived={archived} />

      {messages.length === 0 ? (
        <p className="mt-6 text-sm text-text-muted">
          {archived ? "Nothing archived." : "No messages yet."}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-xl border border-border bg-bg-subtle p-5">
              {m.readable ? (
                <>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-semibold">{m.name}</p>
                    {CONTACT_EMAIL_RE.test(m.email) ? (
                      <a href={`mailto:${m.email}`} className="text-sm text-accent hover:underline">
                        {m.email}
                      </a>
                    ) : (
                      <span className="text-sm text-text-muted">{m.email}</span>
                    )}
                    {!archived && !m.is_read && (
                      <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[11px] text-accent">
                        New
                      </span>
                    )}
                    <span className="ml-auto font-mono text-xs text-text-muted">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed">
                    {m.message}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-500">
                  This message could not be decrypted (wrong key, or the stored
                  data was changed). Received {new Date(m.created_at).toLocaleString()}.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                {archived ? (
                  <>
                    <form action={restoreMessage.bind(null, m.id)}>
                      <button type="submit" className="hover:text-accent">Restore</button>
                    </form>
                    <form action={deleteMessagePermanently.bind(null, m.id)}>
                      <ConfirmButton
                        message="Permanently delete this message? This cannot be undone."
                        className="text-red-500 hover:underline"
                      >
                        Delete permanently
                      </ConfirmButton>
                    </form>
                  </>
                ) : (
                  <>
                    {m.readable && (
                      <form action={setMessageRead.bind(null, m.id, !m.is_read)}>
                        <button type="submit" className="hover:text-accent">
                          {m.is_read ? "Mark as unread" : "Mark as read"}
                        </button>
                      </form>
                    )}
                    <form action={archiveMessage.bind(null, m.id)}>
                      <ConfirmButton
                        message="Archive this message? You can restore it later."
                        className="text-text-muted hover:text-accent"
                      >
                        Archive
                      </ConfirmButton>
                    </form>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}