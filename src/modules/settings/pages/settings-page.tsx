"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBody, PageHeader, useMe, useSignOut } from "@/modules/dashboard";

export function SettingsPage() {
  const me = useMe();
  const { signOut, pending } = useSignOut();

  return (
    <>
      <PageHeader title="Settings" />
      <PageBody>
        <section aria-labelledby="account-title" className="max-w-xl">
          <h2
            id="account-title"
            className="border-b border-border px-2 pb-1.5 text-[13px] font-semibold text-text"
          >
            Account
          </h2>
          <div className="flex items-center justify-between gap-4 border-b border-border px-2 py-2.5">
            {me.isPending ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-8">
                  {me.data?.avatarUrl ? <AvatarImage src={me.data.avatarUrl} alt="" /> : null}
                  <AvatarFallback>
                    {me.data?.githubLogin.charAt(0).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-text">
                    {me.data?.githubLogin ?? "GitHub account not linked"}
                  </p>
                  <p className="text-xs text-text-muted">Signed in with GitHub</p>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" disabled={pending} onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </section>
      </PageBody>
    </>
  );
}
