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

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Reviews</h1>
          <p className="mt-2 max-w-[60ch] text-text-muted">
            Every pull request review Revio has run, newest first.
          </p>
        </div>
        <Select
          items={repoItems}
          value={repo}
          onValueChange={(value) => {
            setRepo(value ?? ALL);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Repository" className="h-10 w-64">
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
      </header>

      {reviews.isPending ? (
        <div
          className="flex flex-col gap-3"
          role="status"
          aria-busy="true"
          aria-label="Loading reviews"
        >
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : reviews.isError ? (
        <p role="alert" className="text-danger">
          {reviews.error.message}
        </p>
      ) : reviews.data.total === 0 ? (
        <p className="border-t border-border py-10 text-text-muted">
          No reviews yet. Revio reviews a pull request when it’s opened or gets new commits.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pull request</TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Issues</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.data.items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[28rem]">
                      <Link href={`/reviews/${r.id}`} className="text-text hover:text-accent">
                        <span className="text-text-muted">#{r.prNumber}</span> {r.prTitle}
                      </Link>
                    </TableCell>
                    <TableCell className="text-text-muted">{r.repoFullName}</TableCell>
                    <TableCell>
                      <StatusLabel status={r.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.issueCount}</TableCell>
                    <TableCell className="text-text-muted">
                      <time dateTime={r.startedAt}>{formatDateTime(r.startedAt)}</time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <nav aria-label="Pages" className="flex items-center justify-between">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <p className="text-sm text-text-muted">
              Page {page} of {pages}
            </p>
            <Button
              variant="outline"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </nav>
        </>
      )}
    </div>
  );
}
