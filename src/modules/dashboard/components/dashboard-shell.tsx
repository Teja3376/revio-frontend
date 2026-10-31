"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { ApiError, SAMPLE_MODE } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMe } from "../api/account";
import { UserMenu } from "./user-menu";

const LINKS = [
  { href: "/repos", label: "Repositories" },
  { href: "/reviews", label: "Reviews" },
  { href: "/settings", label: "Settings" },
];

function DashboardNavWithPath() {
  return <DashboardNav pathname={usePathname()} />;
}

function DashboardNav({ pathname = "" }: { pathname?: string }) {
  return (
    <nav aria-label="Dashboard">
      <ul className="flex gap-1 lg:flex-col">
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm",
                  active ? "bg-surface text-text" : "text-text-muted hover:text-text",
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const me = useMe();
  const unlinked = me.error instanceof ApiError && me.error.status === 404;

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6 border-b border-border px-5 py-5 lg:sticky lg:top-0 lg:h-svh lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3">
          <Wordmark />
          {SAMPLE_MODE ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-warning">
              Sample data
            </span>
          ) : null}
        </div>
        {/* the active link comes from the URL; until it's known, show the links without one */}
        <Suspense fallback={<DashboardNav />}>
          <DashboardNavWithPath />
        </Suspense>
        <div className="hidden lg:mt-auto lg:block">
          <UserMenu />
        </div>
      </aside>
      <main className="mx-auto w-full max-w-page px-6 py-10 lg:px-12">
        {unlinked ? (
          <p role="alert" className="mb-8 rounded-xl border border-border p-4 text-text">
            Revio couldn’t see your GitHub installations yet. Sign out and sign in again to link
            them.
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
