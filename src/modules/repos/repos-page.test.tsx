import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetSampleData } from "@/lib/sample-data";
import { renderWithQuery } from "@/test/render";

vi.mock("@/lib/api", async (importOriginal) =>
  (await import("@/test/sample-api")).sampleApiModule(importOriginal),
);

import { api } from "@/lib/api";
import { ReposPage } from "@/modules/repos";

beforeEach(() => {
  resetSampleData();
  vi.restoreAllMocks();
});

const row = async (name: string) =>
  (await screen.findByRole("heading", { name })).closest("li") as HTMLElement;

describe("ReposPage", () => {
  it("lists each repo with its switch, depth and ignore patterns", async () => {
    renderWithQuery(<ReposPage />);
    const web = await row("example/web-app");
    expect(within(web).getByRole("switch", { name: /review pull requests/i })).toBeChecked();
    expect(within(web).getByRole("combobox", { name: "Depth" })).toHaveTextContent(/full/i);
    const api = await row("example/api-server");
    expect(within(api).getByLabelText("Ignore patterns")).toHaveValue("**/*.snap");
  });

  it("saves turning a repo off", async () => {
    const spy = vi.spyOn(api, "request");
    renderWithQuery(<ReposPage />);
    const web = await row("example/web-app");
    await userEvent.click(within(web).getByRole("switch", { name: /review pull requests/i }));
    expect(within(web).getByRole("switch", { name: /review pull requests/i })).not.toBeChecked();
    expect(spy).toHaveBeenCalledWith(
      "/repos/00000000-0000-4000-8000-000000000001",
      expect.anything(),
      { method: "PATCH", body: { enabled: false } },
    );
  });

  it("puts the switch back and says so when saving fails", async () => {
    renderWithQuery(<ReposPage />);
    const web = await row("example/web-app");
    vi.spyOn(api, "request").mockRejectedValueOnce(new Error("Couldn’t reach Revio."));
    await userEvent.click(within(web).getByRole("switch", { name: /review pull requests/i }));
    expect(await within(web).findByText(/couldn’t save/i)).toBeInTheDocument();
    expect(within(web).getByRole("switch", { name: /review pull requests/i })).toBeChecked();
  });

  it("checks ignore patterns before saving them", async () => {
    const spy = vi.spyOn(api, "request");
    renderWithQuery(<ReposPage />);
    const web = await row("example/web-app");
    const box = within(web).getByLabelText("Ignore patterns");
    await userEvent.type(box, "x".repeat(201));
    await userEvent.click(within(web).getByRole("button", { name: "Save patterns" }));
    expect(await within(web).findByText(/under 200 characters/)).toBeInTheDocument();
    expect(spy).not.toHaveBeenCalledWith(
      expect.stringContaining("/repos/"),
      expect.anything(),
      expect.objectContaining({ method: "PATCH" }),
    );

    await userEvent.clear(box);
    await userEvent.type(box, "docs/**{enter}{enter}  *.md  ");
    await userEvent.click(within(web).getByRole("button", { name: "Save patterns" }));
    expect(await within(web).findByText("Saved")).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("/repos/"), expect.anything(), {
      method: "PATCH",
      body: { ignoreGlobs: ["docs/**", "*.md"] },
    });
  });

  it("points to installing the GitHub App when there are no repos", async () => {
    vi.spyOn(api, "request").mockResolvedValueOnce({ items: [] });
    renderWithQuery(<ReposPage />);
    expect(
      await screen.findByRole("link", { name: /install the github app/i }),
    ).toBeInTheDocument();
  });
});
