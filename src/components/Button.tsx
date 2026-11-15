export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:brightness-110">
      {children}
    </button>
  );
}