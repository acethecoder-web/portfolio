"use client";

export function ThemeToggle() {
  function toggle() {
    const next =
      document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-text-muted hover:text-text"
    >
      theme
    </button>
  );
}