import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "@tests/support/render";
import { describe, expect, it, vi } from "vitest";

const push = vi.fn();
const signOut = vi.fn(async () => ({ error: null }));
// sample data, but the real sign-out path (sample mode skips Supabase)
vi.mock("@/lib/api", async (importOriginal) => ({
  ...(await (await import("@tests/support/sample-api")).sampleApiModule(importOriginal)),
  SAMPLE_MODE: false,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/supabase/client", () => ({ createBrowserSupabase: () => ({ auth: { signOut } }) }));

import { SettingsPage } from "@/modules/settings";

describe("SettingsPage", () => {
  it("shows the GitHub account", async () => {
    renderWithQuery(<SettingsPage />);
    expect(await screen.findByText("sample-user")).toBeInTheDocument();
  });

  it("signs out and goes home", async () => {
    renderWithQuery(<SettingsPage />);
    await userEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/");
  });
});
