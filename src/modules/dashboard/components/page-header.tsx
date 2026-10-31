import type { ReactNode } from "react";

/** Slim bar at the top of every dashboard page: title (and optional context) left, actions right. */
export function PageHeader({
  title,
  meta,
  actions,
}: {
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-bg px-6 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-sm font-semibold text-text">{title}</h1>
        {meta ? <div className="truncate text-[13px] text-text-muted">{meta}</div> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-page px-6 py-4">{children}</div>;
}
