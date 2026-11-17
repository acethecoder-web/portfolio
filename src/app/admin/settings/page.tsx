import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { updateSettings } from "./actions";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function AdminSettingsPage({ searchParams }: Props) {
  await requireAdmin();
  const { saved } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Site settings</h1>
      {saved && (
        <p role="status" className="mb-5 max-w-2xl rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent">
          Settings saved.
        </p>
      )}
      <SettingsForm action={updateSettings} settings={settings} />
    </div>
  );
}