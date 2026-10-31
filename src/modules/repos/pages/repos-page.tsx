"use client";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepos } from "../api/queries";
import { RepoRow } from "../components/repo-row";

const INSTALL_URL = process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || "/docs#install-github";

export function ReposPage() {
  const repos = useRepos();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text">Repositories</h1>
          <p className="mt-2 max-w-[60ch] text-text-muted">
            Revio reviews pull requests in these repositories. Changes save as you make them.
          </p>
        </div>
        <a href={INSTALL_URL} className={buttonVariants({ variant: "outline" })}>
          Add repositories on GitHub
        </a>
      </header>

      {repos.isPending ? (
        <div
          className="flex flex-col gap-4"
          role="status"
          aria-busy="true"
          aria-label="Loading repositories"
        >
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : repos.isError ? (
        <p role="alert" className="text-danger">
          {repos.error.message}
        </p>
      ) : repos.data.items.length === 0 ? (
        <div className="flex flex-col items-start gap-4 border-t border-border py-10">
          <p className="max-w-[55ch] text-text-muted">
            No repositories yet. Install the Revio GitHub App on the repositories you want reviewed;
            they show up here a moment later.
          </p>
          <a href={INSTALL_URL} className={buttonVariants({ size: "xl" })}>
            Install the GitHub App
          </a>
        </div>
      ) : (
        <ul>
          {repos.data.items.map((repo) => (
            <RepoRow key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </div>
  );
}
