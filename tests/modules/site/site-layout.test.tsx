import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { signInWithOAuth: vi.fn() } }),
}));

import { SiteLayout } from "@/modules/site";

describe("SiteLayout", () => {
  it("wraps the page in one header, one main and one footer", () => {
    render(
      <SiteLayout>
        <p>content</p>
      </SiteLayout>,
    );
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    expect(within(screen.getByRole("main")).getByText("content")).toBeInTheDocument();
  });

  it("links to Docs and Connect and offers sign-in in the header", () => {
    render(<SiteLayout>x</SiteLayout>);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(within(nav).getByRole("link", { name: "Connect" })).toHaveAttribute("href", "/connect");
    const header = screen.getByRole("banner");
    expect(
      within(header).getByRole("button", { name: /sign in with github/i }),
    ).toBeInTheDocument();
  });
});
