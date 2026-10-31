"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

/** Shown when a page crashes. The error message stays in the console; it can contain internals. */
export function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => console.error(error), [error]);
  return (
    <StatusPage title="Something went wrong" actions={<Button onClick={reset}>Try again</Button>}>
      <p>This page hit an unexpected error. Try again; if it keeps happening, reload the page.</p>
      {error.digest ? <p className="mt-2 text-xs">Reference: {error.digest}</p> : null}
    </StatusPage>
  );
}
