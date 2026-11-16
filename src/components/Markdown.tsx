// src/components/Markdown.tsx
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 border-b border-gh-border pb-2 text-2xl font-semibold first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-8 border-b border-gh-border pb-2 text-xl font-semibold first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-6 text-lg font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="my-4">{children}</p>,
  a: ({ href, children }) => {
    const external = !!href && !href.startsWith("/") && !href.startsWith("#");
    return (
      <a
        href={href}
        className="text-gh-link hover:underline"
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="my-4 list-disc pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal pl-6">{children}</ol>,
  li: ({ children }) => <li className="my-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-gh-border pl-4 text-gh-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-gh-border" />,
  code: ({ children }) => (
    <code className="rounded bg-gh-subtle px-1.5 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-md border border-gh-border bg-gh-subtle p-4 font-mono text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="my-4 max-w-full rounded-md border border-gh-border"
    />
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gh-border bg-gh-subtle px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gh-border px-3 py-2">{children}</td>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[15px] leading-7">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}