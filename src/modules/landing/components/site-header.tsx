import { Wordmark } from "@/components/wordmark";
import { SignInButton } from "@/modules/auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-6">
        <Wordmark />
        <SignInButton variant="text" className="pt-1.5" />
      </div>
    </header>
  );
}
