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
      screen.getByText("AI code review in your terminal, editor and pull requests."),
      screen.getByRole("button", { name: /sign in with github/i }),
      screen.getByText("npm i -g @revio/cli"),
    ];
    for (const node of nodes) {
      expect(node).not.toHaveAttribute("hidden");
      expect(node.style.opacity).not.toBe("0");
    }
  });
});
