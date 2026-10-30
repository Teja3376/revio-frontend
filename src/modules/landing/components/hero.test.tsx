import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { signInWithOAuth: vi.fn() } }),
}));

import { Hero } from "./hero";

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
});

describe("Hero", () => {
  it("shows the headline, sentence and both actions without hiding them", () => {
    render(<Hero />);
    const nodes = [
      screen.getByRole("heading", { level: 1, name: "Review smarter. Ship confidently." }),
      screen.getByText("Revio reviews every change for bugs and security holes before you ship."),
      screen.getByRole("button", { name: /sign in with github/i }),
      screen.getByText("npm i -g @revio/cli"),
    ];
    for (const node of nodes) {
      expect(node).not.toHaveAttribute("hidden");
      expect(node.style.opacity).not.toBe("0");
    }
  });
});

describe("Hero intro animation", () => {
  const all = readFileSync("src/app/globals.css", "utf8");
  const css = all.slice(all.indexOf("/* Hero load sequence"));

  it("writes each headline line with a reveal", () => {
    const { container } = render(<Hero />);
    const lines = container.querySelectorAll("h1 [data-write]");
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toHaveClass("hero-write");
      expect(line.firstElementChild).toHaveClass("hero-ink");
    }
  });

  it("turns every intro animation off for reduced motion", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/animation:\s*none/);
  });

  it("animates only transform and opacity", () => {
    const frames = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g)].map((m) => m[1]);
    expect(frames.length).toBeGreaterThan(0);
    for (const body of frames) {
      const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      expect(props.every((p) => p === "transform" || p === "opacity")).toBe(true);
    }
  });
});
