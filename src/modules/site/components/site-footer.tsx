import { Wordmark } from "@/components/wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page items-center justify-between px-6 py-10 text-sm text-text-muted">
        <Wordmark className="text-2xl" />
        <p>© 2026 Charan Teja</p>
      </div>
    </footer>
  );
}
