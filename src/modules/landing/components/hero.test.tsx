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

  it("fades the headline in word by word", () => {
    const { container } = render(<Hero />);
    const words = [...container.querySelectorAll("h1 .hero-word")];
    expect(words.map((w) => w.textContent)).toEqual(["Review", "smarter.", "Ship", "confidently."]);
    const delays = words.map((w) =>
      Number.parseFloat((w as HTMLElement).style.getPropertyValue("--delay")),
    );
    for (let i = 1; i < delays.length; i++) expect(delays[i]).toBeGreaterThan(delays[i - 1]);
  });

  it("turns every intro animation off for reduced motion", () => {
    const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/animation:\s*none/);
  });

  // stroke-dashoffset draws the background strands in.
  it("animates only transform, opacity and the strands' stroke-dashoffset", () => {
    const frames = [...css.matchAll(/@keyframes[^{]+\{([\s\S]*?\})\s*\}/g)].map((m) => m[1]);
    expect(frames.length).toBeGreaterThan(0);
    for (const body of frames) {
      const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      expect(props.every((p) => ["transform", "opacity", "stroke-dashoffset"].includes(p))).toBe(
        true,
      );
    }
  });
});
