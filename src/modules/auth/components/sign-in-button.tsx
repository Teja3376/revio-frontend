"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "primary" | "text";
  /** Shows the shorter "Sign in" label on small screens. */
  compact?: boolean;
  className?: string;
};

const FAILED = "Sign-in failed. Try again.";

export function SignInButton({ variant = "primary", compact = false, className }: Props) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("auth_error")) setFailed(true);
  }, []);

  async function signIn() {
    setPending(true);
    setFailed(false);
    try {
      const { error } = await createBrowserSupabase().auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      // On success the browser is already leaving for GitHub; only failures land here.
      if (!error) return;
    } catch {
      // Missing env or a network error: fall through to the failure state.
    }
    setPending(false);
    setFailed(true);
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      <Button
        onClick={signIn}
        disabled={pending}
        variant={variant === "primary" ? "default" : "link"}
        size={variant === "primary" ? "xl" : "default"}
        className={variant === "text" ? "px-0 text-text hover:text-accent" : undefined}
      >
        <GitHubMark />
        {pending ? (
          "Signing in…"
        ) : compact ? (
          <>
            <span className="sm:hidden">Sign in</span>
            <span className="hidden sm:inline">Sign in with GitHub</span>
          </>
        ) : (
          "Sign in with GitHub"
        )}
      </Button>
      <span aria-live="polite" className="text-sm text-danger">
        {failed ? FAILED : null}
      </span>
    </span>
  );
}

function GitHubMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
