import Link from "next/link";
import { ConfirmButton } from "./ConfirmButton";

type BoundAction = () => Promise<void>;

export function RowActions({
  archived,
  editHref,
  itemName,
  archive,
  restore,
  remove,
  deleteNote = "",
  children,
}: {
  archived: boolean;
  editHref: string;
  itemName: string;
  archive: BoundAction;
  restore: BoundAction;
  remove: BoundAction;
  deleteNote?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-end gap-4">
      {archived ? (
        <>
          <form action={restore}>
            <button type="submit" className="hover:text-accent">
              Restore
            </button>
          </form>
          <form action={remove}>
            <ConfirmButton
              message={`Permanently delete "${itemName}"? ${deleteNote}This cannot be undone.`}
              className="text-red-500 hover:underline"
            >
              Delete permanently
            </ConfirmButton>
          </form>
        </>
      ) : (
        <>
          {children}
          <Link href={editHref} className="hover:text-accent">
            Edit
          </Link>
          <form action={archive}>
            <ConfirmButton
              message={`Archive "${itemName}"? It will be hidden from your site. You can restore it later.`}
              className="text-text-muted hover:text-accent"
            >
              Archive
            </ConfirmButton>
          </form>
        </>
      )}
    </div>
  );
}