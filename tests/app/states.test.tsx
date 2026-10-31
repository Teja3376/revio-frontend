import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DashboardError from "@/app/(dashboard)/error";
import RootError from "@/app/error";
import GlobalError from "@/app/global-error";
import NotFound from "@/app/not-found";

describe("not found page", () => {
  it("says the page doesn't exist and links home and to the dashboard", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Open the dashboard" })).toHaveAttribute(
      "href",
      "/repos",
    );
  });
});

describe.each([
  ["site", RootError],
  ["dashboard", DashboardError],
])("%s error page", (_, ErrorPage) => {
  it("explains the failure and retries on request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    render(
      <ErrorPage error={Object.assign(new Error("boom"), { digest: "abc123" })} reset={reset} />,
    );
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
    expect(screen.queryByText("boom")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});

describe("global error page", () => {
  it("renders a full document with a retry button", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    // React warns about <html> inside the test's <div>; that warning is silenced above.
    render(<GlobalError error={new Error("layout broke")} reset={reset} />);
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });
});
