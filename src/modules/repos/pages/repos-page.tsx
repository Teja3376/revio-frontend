"use client";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBody, PageHeader } from "@/modules/dashboard";
import { useRepos } from "../api/queries";
import { RepoRow } from "../components/repo-row";

const INSTALL_URL = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "/docs#install-github";

export function ReposPage() {
  const repos = useRepos();

  const install = (
    <a href={INSTALL_URL} className={buttonVariants({ variant: "outline", size: "sm" })}>
      Add repositories on GitHub
    </a>
  );

  return (
    <>
      <PageHeader
        title="Repositories"
        meta={
          repos.data
            ? `${repos.data.items.filter((r) => r.enabled).length} of ${repos.data.items.length} reviewing · changes save as you make them`
            : undefined
        }
        actions={install}
      />
      <PageBody>
        {repos.isPending ? (
          <div
            className="flex flex-col gap-1"
            role="status"
            aria-busy="true"
            aria-label="Loading repositories"
          >
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </div>
        ) : repos.isError ? (
          <p role="alert" className="text-[13px] text-danger">
            {repos.error.message}
          </p>
        ) : repos.data.items.length === 0 ? (
          <div className="flex flex-col items-start gap-3 py-8">
            <p className="max-w-[55ch] text-[13px] text-text-muted">
              No repositories yet. Install the Revio GitHub App on the repositories you want
              reviewed; they show up here a moment later.
            </p>
            <a href={INSTALL_URL} className={buttonVariants({ size: "sm" })}>
              Install the GitHub App
            </a>
          </div>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="flex items-center gap-4 border-b border-border px-2 pb-2 text-xs text-text-muted"
            >
              <span className="w-8">On</span>
              <span className="flex-1">Repository</span>
              <span className="hidden w-60 sm:block">Depth</span>
              <span className="hidden w-36 sm:block">Ignored files</span>
            </div>
            <ul>
              {repos.data.items.map((repo) => (
                <RepoRow key={repo.id} repo={repo} />
              ))}
            </ul>
          </>
        )}
      </PageBody>
    </>
  );
}
