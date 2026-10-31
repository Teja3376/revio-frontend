import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "@tests/support/render";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", async (importOriginal) =>
  (await import("@tests/support/sample-api")).sampleApiModule(importOriginal),
);
vi.mock("next/navigation", () => ({
  usePathname: () => "/reviews/abc",
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { signOut: vi.fn() } }),
}));

import { ApiError, api } from "@/lib/api";
import { DashboardShell } from "@/modules/dashboard";

beforeEach(() => vi.restoreAllMocks());

describe("DashboardShell", () => {
  it("links the three dashboard pages and marks the current one", async () => {
    renderWithQuery(<DashboardShell>content</DashboardShell>);
    const nav = screen.getByRole("navigation", { name: "Dashboard" });
    expect(within(nav).getByRole("link", { name: "Repositories" })).toHaveAttribute(
      "href",
      "/repos",
    );
    expect(within(nav).getByRole("link", { name: "Reviews" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
    expect(screen.getByRole("main")).toHaveTextContent("content");
  });

  it("shows who is signed in", async () => {
    renderWithQuery(<DashboardShell>x</DashboardShell>);
    expect(await screen.findByText("sample-user")).toBeInTheDocument();
  });

  it("links to the signed-in user's GitHub profile from the account menu", async () => {
    renderWithQuery(<DashboardShell>x</DashboardShell>);
    await screen.findByText("sample-user");
    await userEvent.click(screen.getByRole("button", { name: "Account" }));
    const item = await screen.findByRole("menuitem", { name: "GitHub profile" });
    expect(item).toHaveAttribute("href", "https://github.com/sample-user");
    expect(item).toHaveAttribute("target", "_blank");
  });

  it("says plainly when it is showing sample data", () => {
    renderWithQuery(<DashboardShell>x</DashboardShell>);
    expect(screen.getByText("Sample data")).toBeInTheDocument();
  });

  it("asks the user to sign in again when GitHub isn't linked", async () => {
    vi.spyOn(api, "request").mockRejectedValue(
      new ApiError("Link your GitHub account first.", 404),
    );
    renderWithQuery(<DashboardShell>x</DashboardShell>);
    expect(await screen.findByRole("alert")).toHaveTextContent(/sign out and sign in again/i);
  });
});
