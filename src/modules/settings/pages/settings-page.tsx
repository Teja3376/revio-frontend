"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useSignOut } from "@/modules/dashboard";

export function SettingsPage() {
  const me = useMe();
  const { signOut, pending } = useSignOut();

  return (
    <div className="flex max-w-[60ch] flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold text-text">Settings</h1>
      </header>
      <section aria-labelledby="account-title" className="flex flex-col gap-4">
        <h2 id="account-title" className="text-lg font-semibold text-text">
          Account
        </h2>
        {me.isPending ? (
          <Skeleton className="h-12 w-64" />
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              {me.data?.avatarUrl ? <AvatarImage src={me.data.avatarUrl} alt="" /> : null}
              <AvatarFallback>{me.data?.githubLogin.charAt(0).toUpperCase() ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-text">{me.data?.githubLogin ?? "GitHub account not linked"}</p>
              <p className="text-sm text-text-muted">Signed in with GitHub</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="self-start"
          disabled={pending}
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </section>
    </div>
  );
}
