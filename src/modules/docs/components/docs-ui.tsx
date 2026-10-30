import type { ReactNode } from "react";
import { CopyCommand } from "@/components/copy-command";

export function DocSection({
  id,
  title,
  status,
  level = 2,
  children,
}: {
  id: string;
  title: string;
  status?: string;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="flex flex-wrap items-center gap-3">
        <Heading
          id={`${id}-title`}
          className={
            level === 2 ? "text-3xl font-semibold text-text" : "text-xl font-semibold text-text"
          }
        >
          {title}
        </Heading>
        {status ? (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-muted">
            {status}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-4 leading-7 text-text-muted [&>h3]:max-w-[72ch] [&>p]:max-w-[72ch]">
        {children}
      </div>
    </section>
  );
}

/** A one-line shell command with a copy button. */
export function Command({ children }: { children: string }) {
  return <CopyCommand command={children} className="max-w-full self-start" />;
}

/** A multi-line code or config sample. */
export function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-surface">
      {label ? (
        <figcaption className="border-b border-border px-4 py-2 text-xs text-text-muted">
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto px-4 py-3 text-sm leading-6 text-text">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface px-1.5 py-0.5 text-[0.9em] text-text">{children}</code>
  );
}

export function DocTable({
  label,
  head,
  rows,
}: {
  label: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table aria-label={label} className="w-full text-left text-sm">
        <thead className="bg-surface text-text">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static rows that never reorder
            <tr key={i} className="border-t border-border">
              {row.map((cell, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static cells that never reorder
                <td key={j} className="px-4 py-2.5 align-top text-text-muted">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
