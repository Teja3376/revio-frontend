import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("font-display text-3xl leading-none text-accent", className)}
      aria-label="Revio home"
    >
      revio
    </Link>
  );
}
