import type { CSSProperties, ReactNode } from "react";
import { CopyCommand } from "@/components/copy-command";
import { ParallaxScrolling } from "@/components/ui/parallax-scrolling";
import { SignInButton } from "@/modules/auth";
import { CodeLinesLayer, CommentChipsLayer, DiffBlocksLayer } from "./hero-layers";

/** One headline line, written left to right on load. */
function Written({
  children,
  delay,
  duration,
}: {
  children: ReactNode;
  delay: string;
  duration: string;
}) {
  return (
    <span
      data-write
      className="hero-write"
      style={{ "--delay": delay, "--duration": duration } as CSSProperties}
    >
      <span className="hero-ink">{children}</span>
    </span>
  );
}

// Layer speeds from DESIGN.md: 70 / 55 / 40 (title) / 10 — higher looks farther away.
export function Hero() {
  return (
    <ParallaxScrolling className="min-h-[calc(100svh-4rem)]">
      <div data-parallax-layer="70" className="absolute inset-0 will-change-transform">
        <div className={"size-full hero-fade"}>
          <CodeLinesLayer />
        </div>
      </div>
      <div data-parallax-layer="55" className="absolute inset-0 will-change-transform">
        <DiffBlocksLayer />
      </div>
      <div
        data-parallax-layer="40"
        className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-page flex-col items-center justify-center px-6 py-16 text-center will-change-transform"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(closest-side,var(--color-bg)_55%,transparent)]" />
        <h1 className="font-display text-6xl leading-[1.1] text-text sm:text-7xl md:text-8xl">
          <span className="block">
            <Written delay="0.2s" duration="1s">
              Review smarter.
            </Written>
          </span>{" "}
          <span className="block text-accent">
            <Written delay="1s" duration="1.1s">
              Ship confidently.
            </Written>
          </span>
        </h1>
        <div className={"hero-after flex flex-col items-center"}>
          <p className="mt-10 max-w-2xl text-lg text-text-muted">
            Revio reviews every change for bugs and security holes before you ship.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <SignInButton variant="primary" />
            <CopyCommand command="npm i -g @revio/cli" />
          </div>
        </div>
      </div>
      <div
        data-parallax-layer="10"
        className="pointer-events-none absolute inset-0 z-20 hidden will-change-transform lg:block"
      >
        <CommentChipsLayer />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-b from-transparent to-bg" />
    </ParallaxScrolling>
  );
}
