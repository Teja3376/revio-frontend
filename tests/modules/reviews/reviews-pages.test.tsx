import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "@tests/support/render";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetSampleData } from "@/lib/sample-data";

vi.mock("@/lib/api", async (importOriginal) =>
  (await import("@tests/support/sample-api")).sampleApiModule(importOriginal),
);

import { api } from "@/lib/api";
import { ReviewDetailPage, ReviewsPage } from "@/modules/reviews";

beforeEach(() => {
  resetSampleData();
  vi.restoreAllMocks();
});

describe("ReviewsPage", () => {
  it("lists reviews newest first, each linking to its page", async () => {
    renderWithQuery(<ReviewsPage />);
    const rows = (await screen.findAllByRole("row")).slice(1);
    expect(rows).toHaveLength(4);
    const first = within(rows[0] as HTMLElement);
    expect(first.getByRole("link", { name: /#42 add user lookup endpoint/i })).toHaveAttribute(
      "href",
      "/reviews/00000000-0000-4000-a000-000000000001",
    );
    expect(first.getByText("example/web-app")).toBeInTheDocument();
    expect(first.getByText("Done")).toBeInTheDocument();
    expect(within(rows[3] as HTMLElement).getByText("Failed")).toBeInTheDocument();
  });

  it("filters by repository", async () => {
    renderWithQuery(<ReviewsPage />);
    await screen.findAllByRole("row");
    await userEvent.click(screen.getByRole("combobox", { name: "Repository" }));
    await userEvent.click(await screen.findByRole("option", { name: "example/api-server" }));
    const rows = (await screen.findAllByRole("row")).slice(1);
    expect(rows.every((r) => within(r).queryByText("example/api-server"))).toBe(true);
    expect(rows).toHaveLength(2);
  });

  it("pages through long histories", async () => {
    const spy = vi.spyOn(api, "request").mockImplementation(async (path: string) => {
      if (path.startsWith("/repos")) return { items: [] };
      const page = Number(new URL(path, "https://x").searchParams.get("page"));
      return { items: [], page, pageSize: 20, total: 45 };
    });
    renderWithQuery(<ReviewsPage />);
    expect(await screen.findByText("Page 1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Page 2 of 3")).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith("/reviews?page=2", expect.anything());
  });

  it("explains an empty history", async () => {
    vi.spyOn(api, "request").mockImplementation(async (path: string) =>
      path.startsWith("/repos") ? { items: [] } : { items: [], page: 1, pageSize: 20, total: 0 },
    );
    renderWithQuery(<ReviewsPage />);
    expect(await screen.findByText(/no reviews yet/i)).toBeInTheDocument();
  });

  it("says when a filtered repository has no reviews, and offers to clear the filter", async () => {
    vi.spyOn(api, "request").mockImplementation(async (path: string) => {
      if (path.startsWith("/repos"))
        return {
          items: [
            { id: "r1", fullName: "example/quiet", enabled: true, depth: "full", ignoreGlobs: [] },
          ],
        };
      return path.includes("repo=r1")
        ? { items: [], page: 1, pageSize: 20, total: 0 }
        : { items: [], page: 1, pageSize: 20, total: 3 };
    });
    renderWithQuery(<ReviewsPage />);
    await userEvent.click(await screen.findByRole("combobox", { name: "Repository" }));
    await userEvent.click(await screen.findByRole("option", { name: "example/quiet" }));
    expect(await screen.findByText("No reviews for example/quiet yet.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Show all repositories" }));
    expect(await screen.findByText("Page 1 of 1")).toBeInTheDocument();
  });
});

describe("ReviewDetailPage", () => {
  it("shows the summary, risk and issues grouped by file with fixes", async () => {
    renderWithQuery(<ReviewDetailPage id="00000000-0000-4000-a000-000000000001" />);
    expect(
      await screen.findByRole("heading", { level: 1, name: "Add user lookup endpoint" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /#42 on github/i })).toHaveAttribute(
      "href",
      "https://github.com/example/web-app/pull/42",
    );
    expect(screen.getByText("High")).toBeInTheDocument();
    const file = screen
      .getByRole("heading", { level: 2, name: "src/api/users.ts" })
      .closest("section") as HTMLElement;
    expect(within(file).getAllByRole("listitem")).toHaveLength(2);
    expect(within(file).getByText(/parameterized|\$1/)).toBeInTheDocument();
    expect(within(file).getByText("Line 42")).toBeInTheDocument();
  });

  it("shows why a review failed", async () => {
    renderWithQuery(<ReviewDetailPage id="00000000-0000-4000-a000-000000000004" />);
    expect(
      await screen.findByText("Gemini did not respond in time. Try again."),
    ).toBeInTheDocument();
  });

  it("says when a review doesn't exist", async () => {
    renderWithQuery(<ReviewDetailPage id="nope" />);
    expect(await screen.findByText("Review not found.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /all reviews/i })).toHaveAttribute("href", "/reviews");
  });
});
