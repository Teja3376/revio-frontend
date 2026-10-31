import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { SignInButton } from "@/modules/auth";

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/connect", label: "Connect" },
];

export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-50 h-16 border-b border-border/60 bg-bg/80 backdrop-blur"
    >
      <div className="mx-auto flex h-full max-w-page items-center justify-between gap-6 px-6">
        <Wordmark />
        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Main">
            <ul className="flex items-center gap-5 text-sm sm:gap-8">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-text-muted hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SignInButton variant="text" compact className="pt-1.5" />
        </div>
      </div>
    </header>
  );
}
