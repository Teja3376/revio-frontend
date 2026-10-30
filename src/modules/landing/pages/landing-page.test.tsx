import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { signInWithOAuth: vi.fn() } }),
}));

import { LandingPage } from "@/modules/landing";

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
});

describe("LandingPage", () => {
  it("has one h1, one header and one footer", () => {
    render(<LandingPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  });

  it("offers sign-in in the header and the hero", () => {
    render(<LandingPage />);
    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("button", { name: /sign in with github/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /sign in with github/i }).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("lists the three install options", () => {
    render(<LandingPage />);
    const install = screen.getByRole("region", { name: /get revio/i });
    expect(within(install).getByText("npm i -g @revio/cli")).toBeInTheDocument();
    expect(within(install).getByText("Coming soon to the Marketplace")).toBeInTheDocument();
    expect(
      within(install).getByRole("button", { name: /sign in with github/i }),
    ).toBeInTheDocument();
  });

  it("never links to the private repos", () => {
    const { container } = render(<LandingPage />);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.filter((h) => h.includes("github.com/Teja3376"))).toEqual([]);
  });
});
