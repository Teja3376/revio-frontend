import type { ReactNode } from "react";

/** Full-area message for 404s and crashes: what happened, then what to do next. */
export function StatusPage({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-[60svh] w-full max-w-md flex-col items-start justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
      <div className="text-[15px] leading-7 text-text-muted">{children}</div>
      <div className="flex flex-wrap items-center gap-3">{actions}</div>
    </section>
  );
}
