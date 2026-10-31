"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { PageBody, PageHeader } from "@/modules/dashboard";
import { useRepos } from "@/modules/repos";
import { useReviews } from "../api/queries";
import { StatusLabel } from "../components/status-label";

const ALL = "all";

export function ReviewsPage() {
  const [repo, setRepo] = useState(ALL);
  const [page, setPage] = useState(1);
  const repos = useRepos();
  const reviews = useReviews({ repo: repo === ALL ? undefined : repo, page });

  const repoItems = [
    { value: ALL, label: "All repositories" },
    ...(repos.data?.items.map((r) => ({ value: r.id, label: r.fullName })) ?? []),
  ];
  const pages = reviews.data
    ? Math.max(1, Math.ceil(reviews.data.total / reviews.data.pageSize))
    : 1;

  const filter = (
    <Select
      items={repoItems}
      value={repo}
      onValueChange={(value) => {
        setRepo(value ?? ALL);
        setPage(1);
      }}
    >
      <SelectTrigger size="sm" aria-label="Repository" className="w-56 text-[13px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {repoItems.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  const head = "h-8 px-2 text-xs font-normal text-text-muted";
  const cell = "px-2 py-1.5 text-[13px]";

  return (
    <>
      <PageHeader
        title="Reviews"
        meta={reviews.data ? `${reviews.data.total} total · newest first` : undefined}
        actions={filter}
      />
      <PageBody>
        {reviews.isPending ? (
          <div
            className="flex flex-col gap-1"
            role="status"
            aria-busy="true"
            aria-label="Loading reviews"
          >
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        ) : reviews.isError ? (
          <p role="alert" className="text-[13px] text-danger">
            {reviews.error.message}
          </p>
        ) : reviews.data.total === 0 && repo !== ALL ? (
          <div className="flex flex-col items-start gap-3 py-8">
            <p className="text-[13px] text-text-muted">
              No reviews for {repoItems.find((r) => r.value === repo)?.label ?? "this repository"}{" "}
              yet.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRepo(ALL);
                setPage(1);
              }}
            >
              Show all repositories
            </Button>
          </div>
        ) : reviews.data.total === 0 ? (
          <p className="py-8 text-[13px] text-text-muted">
            No reviews yet. Revio reviews a pull request when it’s opened or gets new commits.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead
                    className={`${head} max-sm:sticky max-sm:left-0 max-sm:z-10 max-sm:bg-bg`}
                  >
                    Pull request
                  </TableHead>
                  <TableHead className={head}>Repository</TableHead>
                  <TableHead className={head}>Status</TableHead>
                  <TableHead className={`${head} text-right`}>Issues</TableHead>
                  <TableHead className={`${head} text-right`}>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.data.items.map((r) => (
                  <TableRow key={r.id} className="border-border hover:bg-surface/40">
                    <TableCell
                      className={`${cell} max-w-[32rem] truncate max-sm:sticky max-sm:left-0 max-sm:z-10 max-sm:bg-bg`}
                    >
                      <Link
                        href={`/reviews/${r.id}`}
                        className="font-medium text-text hover:text-accent focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="text-text-muted tabular-nums">#{r.prNumber}</span>{" "}
                        {r.prTitle}
                      </Link>
                    </TableCell>
                    <TableCell className={`${cell} text-text-muted`}>{r.repoFullName}</TableCell>
                    <TableCell className={cell}>
                      <StatusLabel status={r.status} />
                    </TableCell>
                    <TableCell className={`${cell} text-right tabular-nums`}>
                      {r.issueCount}
                    </TableCell>
                    <TableCell className={`${cell} text-right text-text-muted tabular-nums`}>
                      <time dateTime={r.startedAt}>{formatDateTime(r.startedAt)}</time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <nav aria-label="Pages" className="flex items-center justify-end gap-3 pt-3">
              <p className="text-xs text-text-muted tabular-nums">
                Page {page} of {pages}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </nav>
          </>
        )}
      </PageBody>
    </>
  );
}
