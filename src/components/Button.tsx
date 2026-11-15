export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-fg shadow-lg shadow-accent/25 transition hover:brightness-110">
      {children}
    </button>
  );
}