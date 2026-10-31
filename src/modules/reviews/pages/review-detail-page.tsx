"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { useReview } from "../api/queries";
import { StatusLabel } from "../components/status-label";
import type { Issue } from "../schemas";

const SEVERITY: Record<Issue["severity"], string> = {
  error: "text-danger",
  warning: "text-warning",
  info: "text-info",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function byFile(issues: Issue[]) {
  const groups = new Map<string, Issue[]>();
  for (const i of issues) groups.set(i.file, [...(groups.get(i.file) ?? []), i]);
  return [...groups];
}

export function ReviewDetailPage({ id }: { id: string }) {
  const review = useReview(id);
  const back = (
    <Link href="/reviews" className="text-sm text-text-muted hover:text-text">
      ← All reviews
    </Link>
  );

  if (review.isPending) {
    return (
      <div
        className="flex flex-col gap-4"
        role="status"
        aria-busy="true"
        aria-label="Loading review"
      >
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24" />
      </div>
    );
  }
  if (review.isError) {
    return (
      <div className="flex flex-col items-start gap-4">
        {back}
        <p role="alert" className="text-danger">
          {review.error.message}
        </p>
      </div>
    );
  }

  const r = review.data;
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        {back}
        <h1 className="text-3xl font-semibold text-text">{r.prTitle}</h1>
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-muted">
          <a href={r.prUrl} className="text-accent underline underline-offset-4">
            #{r.prNumber} on GitHub
          </a>
          <span>{r.repoFullName}</span>
          <StatusLabel status={r.status} />
          <time dateTime={r.startedAt}>{formatDateTime(r.startedAt)}</time>
        </p>
      </header>

      {r.error ? (
        <section aria-labelledby="error-title" className="rounded-xl border border-border p-5">
          <h2 id="error-title" className="font-semibold text-text">
            Why this review failed
          </h2>
          <p className="mt-2 text-danger">{r.error}</p>
        </section>
      ) : null}

      {r.summary || r.risk ? (
        <dl className="grid max-w-[72ch] grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {r.risk ? (
            <>
              <dt className="text-text-muted">Risk</dt>
              <dd
                className={
                  r.risk === "high" ? "font-semibold text-danger" : "font-semibold text-text"
                }
              >
                {cap(r.risk)}
              </dd>
            </>
          ) : null}
          {r.summary ? (
            <>
              <dt className="text-text-muted">Summary</dt>
              <dd className="leading-7 text-text">{r.summary}</dd>
            </>
          ) : null}
        </dl>
      ) : null}

      {r.status === "done" && r.issues.length === 0 ? (
        <p className="text-text-muted">No issues found in this pull request.</p>
      ) : null}

      {byFile(r.issues).map(([file, issues]) => (
        <section key={file} aria-labelledby={`f-${file}`} className="flex flex-col gap-4">
          <h2 id={`f-${file}`} className="text-lg font-semibold text-text">
            {file}
          </h2>
          <ol className="flex flex-col gap-4">
            {issues.map((i) => (
              <li key={i.id} className="rounded-xl border border-border p-5">
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="text-text-muted">
                    {i.endLine && i.endLine !== i.line
                      ? `Lines ${i.line}–${i.endLine}`
                      : `Line ${i.line}`}
                  </span>
                  <span className={`font-medium ${SEVERITY[i.severity]}`}>{cap(i.severity)}</span>
                  <span className="text-text-muted">{cap(i.category)}</span>
                </p>
                <p className="mt-2 text-text">{i.message}</p>
                {i.suggestion ? (
                  <figure className="mt-4">
                    <figcaption className="text-sm text-text-muted">Suggested fix</figcaption>
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-surface px-4 py-3 text-sm text-text">
                      <code>{i.suggestion}</code>
                    </pre>
                  </figure>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </article>
  );
}
