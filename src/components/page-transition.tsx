import { type ReactNode, ViewTransition } from "react";

/** Fades a page out and the next one in when navigating between pages. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
