import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const seen = vi.hoisted(() => ({ options: [] as unknown[] }));
vi.mock("lenis/react", () => ({
  ReactLenis: ({ options, children }: { options: unknown; children: React.ReactNode }) => {
    seen.options.push(options);
    return <>{children}</>;
  },
  useLenis: () => undefined,
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

import { SmoothScroll } from "@/components/smooth-scroll";

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduce,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as never;
}

beforeEach(() => {
  seen.options = [];
});

describe("SmoothScroll", () => {
  it("renders the page inside it", () => {
    setReducedMotion(false);
    render(<SmoothScroll>page</SmoothScroll>);
    expect(screen.getByText("page")).toBeInTheDocument();
  });

  it("glides to #anchors below the sticky header", () => {
    setReducedMotion(false);
    render(<SmoothScroll>page</SmoothScroll>);
    expect(seen.options.at(-1)).toMatchObject({ smoothWheel: true, anchors: { offset: -80 } });
  });

  it("turns smoothing off and jumps instantly with reduced motion", () => {
    setReducedMotion(true);
    render(<SmoothScroll>page</SmoothScroll>);
    expect(seen.options.at(-1)).toMatchObject({
      smoothWheel: false,
      anchors: { offset: -80, immediate: true },
    });
  });
});
