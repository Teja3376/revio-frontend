"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { PageBody, PageHeader } from "@/modules/dashboard";
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
    <Link
      href="/reviews"
      className="rounded-md px-2 py-1 text-[13px] text-text-muted hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-ring"
    >
      All reviews
    </Link>
  );

  if (review.isPending) {
    return (
      <PageBody>
        <div
          className="flex flex-col gap-2"
          role="status"
          aria-busy="true"
          aria-label="Loading review"
        >
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-20" />
        </div>
      </PageBody>
    );
  }
  if (review.isError) {
    return (
      <PageBody>
        <div className="flex flex-col items-start gap-3">
          {back}
          <p role="alert" className="text-[13px] text-danger">
            {review.error.message}
          </p>
        </div>
      </PageBody>
    );
  }

  const r = review.data;
  return (
    <article>
      <PageHeader
        title={r.prTitle}
        meta={
          <span className="flex items-center gap-3">
            <span>{r.repoFullName}</span>
            <StatusLabel status={r.status} />
            <time dateTime={r.startedAt} className="tabular-nums">
              {formatDateTime(r.startedAt)}
            </time>
          </span>
        }
        actions={
          <>
            {back}
            <a
              href={r.prUrl}
              className="rounded-md border border-border px-2.5 py-1 text-[13px] text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
            >
              #{r.prNumber} on GitHub
            </a>
          </>
        }
      />
      <PageBody>
        <div className="flex flex-col gap-6">
          {r.error ? (
            <section aria-labelledby="error-title" className="border-l-2 border-danger py-1 pl-3">
              <h2 id="error-title" className="text-[13px] font-semibold text-text">
                Why this review failed
              </h2>
              <p className="mt-1 text-[13px] text-danger">{r.error}</p>
            </section>
          ) : null}

          {r.summary || r.risk ? (
            <dl className="grid max-w-[80ch] grid-cols-[5rem_1fr] gap-x-4 gap-y-1.5 text-[13px]">
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
                  <dd className="leading-6 text-text">{r.summary}</dd>
                </>
              ) : null}
            </dl>
          ) : null}

          {r.status === "done" && r.issues.length === 0 ? (
            <p className="text-[13px] text-text-muted">No issues found in this pull request.</p>
          ) : null}

          {byFile(r.issues).map(([file, issues]) => (
            <section key={file} aria-labelledby={`f-${file}`}>
              <div className="flex items-center justify-between border-b border-border px-2 pb-1.5">
                <h2 id={`f-${file}`} className="truncate text-[13px] font-semibold text-text">
                  {file}
                </h2>
                <span className="text-xs text-text-muted tabular-nums">
                  {issues.length} {issues.length === 1 ? "issue" : "issues"}
                </span>
              </div>
              <ol>
                {issues.map((i) => (
                  <li
                    key={i.id}
                    className="grid grid-cols-[6.5rem_4.5rem_6rem_minmax(0,1fr)] gap-x-3 border-b border-border px-2 py-2 text-[13px] max-md:grid-cols-[6.5rem_minmax(0,1fr)]"
                  >
                    <span className="text-text-muted tabular-nums">
                      {i.endLine && i.endLine !== i.line
                        ? `Lines ${i.line}–${i.endLine}`
                        : `Line ${i.line}`}
                    </span>
                    <span className={`font-medium ${SEVERITY[i.severity]}`}>{cap(i.severity)}</span>
                    <span className="text-text-muted max-md:hidden">{cap(i.category)}</span>
                    <div className="min-w-0 max-md:col-span-2">
                      <p className="text-text">{i.message}</p>
                      {i.suggestion ? (
                        <details className="mt-1.5">
                          <summary className="cursor-pointer text-xs text-text-muted hover:text-text">
                            Suggested fix
                          </summary>
                          <pre className="mt-1.5 overflow-x-auto rounded-md bg-surface px-3 py-2 text-xs text-text">
                            <code>{i.suggestion}</code>
                          </pre>
                        </details>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </PageBody>
    </article>
  );
}
