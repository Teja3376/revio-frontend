import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signInWithOAuth = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabase: () => ({ auth: { signInWithOAuth } }),
}));

import { SignInButton } from "./components/sign-in-button";

const FAILED = "Sign-in failed. Try again.";

beforeEach(() => {
  signInWithOAuth.mockReset();
  window.history.replaceState(null, "", "/");
});
afterEach(() => window.history.replaceState(null, "", "/"));

describe("SignInButton", () => {
  it("starts GitHub OAuth with the callback URL", async () => {
    signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    render(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /sign in with github/i }));
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  });

  it("disables itself while the redirect is pending", async () => {
    signInWithOAuth.mockReturnValue(new Promise(() => {}));
    render(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /sign in with github/i }));
    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();
  });

  it("shows an error and re-enables when OAuth fails", async () => {
    signInWithOAuth.mockResolvedValue({ data: {}, error: new Error("provider is not enabled") });
    render(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /sign in with github/i }));
    expect(await screen.findByText(FAILED)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with github/i })).toBeEnabled();
  });

  it("shows the error and re-enables when the Supabase client throws", async () => {
    signInWithOAuth.mockImplementation(() => {
      throw new Error("Your project's URL and Key are required");
    });
    render(<SignInButton />);
    await userEvent.click(screen.getByRole("button", { name: /sign in with github/i }));
    expect(await screen.findByText(FAILED)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with github/i })).toBeEnabled();
  });

  it("shows the error when the callback sent the user back with auth_error", async () => {
    window.history.replaceState(null, "", "/?auth_error=1");
    render(<SignInButton />);
    expect(await screen.findByText(FAILED)).toBeInTheDocument();
  });
});
