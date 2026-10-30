"use client";

import { Check, Copy, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "copied" | "failed";

const LABEL: Record<State, string> = {
  idle: "Copy command",
  copied: "Copied",
  failed: "Copy failed",
};

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(command);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const Icon = state === "copied" ? Check : state === "failed" ? X : Copy;

  return (
    <div
      className={cn(
        "inline-flex h-11 items-center gap-3 rounded-lg border border-border bg-surface pl-4 pr-1.5",
        className,
      )}
    >
      <span aria-hidden="true" className="select-none text-sm text-text-muted">
        $
      </span>
      <code className="-ml-1 select-all text-sm text-text">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={LABEL[state]}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-text-muted hover:text-text",
          state === "copied" && "text-diff-add",
          state === "failed" && "text-danger",
        )}
      >
        <Icon aria-hidden="true" className="size-4" />
      </button>
      {/* Visible when copying fails, so the reader knows to select the text by hand. */}
      <span
        aria-live="polite"
        className={state === "failed" ? "pr-2 text-xs text-danger" : "sr-only"}
      >
        {state === "idle" ? "" : LABEL[state]}
      </span>
    </div>
  );
}
