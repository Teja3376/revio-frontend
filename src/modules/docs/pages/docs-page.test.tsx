import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocsPage } from "@/modules/docs";

describe("DocsPage", () => {
  it("has one h1 and a sidebar whose links all land on a section", () => {
    const { container } = render(<DocsPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const nav = screen.getByRole("navigation", { name: "Docs sections" });
    const links = within(nav).getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(10);
    for (const link of links) {
      const id = link.getAttribute("href")?.replace("#", "") ?? "";
      expect(container.querySelector(`[id="${id}"]`), id).not.toBeNull();
    }
  });

  it("documents the real CLI commands", () => {
    const { container } = render(<DocsPage />);
    const text = container.textContent ?? "";
    for (const cmd of [
      "npm i -g @revio/cli",
      "revio review",
      "revio review --staged",
      "revio review --base main",
      "revio watch",
      "revio hook install",
      "revio hook install --block-on error",
      "revio hook uninstall",
      "export GEMINI_API_KEY=",
    ]) {
      expect(text, cmd).toContain(cmd);
    }
  });

  it("lists the CLI exit codes", () => {
    render(<DocsPage />);
    const table = screen.getByRole("table", { name: "Exit codes" });
    expect(within(table).getAllByRole("row")).toHaveLength(4);
  });

  it("says honestly which tools are not ready yet", () => {
    render(<DocsPage />);
    expect(
      within(document.getElementById("install-vscode") as HTMLElement).getByText("In progress"),
    ).toBeInTheDocument();
    expect(
      within(document.getElementById("install-github") as HTMLElement).getByText("Coming soon"),
    ).toBeInTheDocument();
  });

  it("documents every .revio.json key", () => {
    render(<DocsPage />);
    const table = screen.getByRole("table", { name: ".revio.json keys" });
    for (const key of ["depth", "ignore", "model", "rules"]) {
      expect(within(table).getByText(key)).toBeInTheDocument();
    }
  });

  it("tells users new files need git add before revio review sees them", () => {
    const { container } = render(<DocsPage />);
    expect(container.textContent).toContain("git add");
  });

  it("warns that --block-on in the hook also blocks commits when the review can't run", () => {
    const hook = document.createElement("div");
    const { container } = render(<DocsPage />);
    hook.innerHTML = container.querySelector("#setup-hook")?.innerHTML ?? "";
    expect(hook.textContent).toMatch(/can.t run/i);
  });

  it("lets each kind of developer pick a starting point", () => {
    render(<DocsPage />);
    const paths = screen.getByRole("list", { name: "Pick your path" });
    const links = within(paths)
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(links).toEqual(["#first-review", "#daily-use", "#ci"]);
  });

  it("walks a beginner through a first review step by step", () => {
    render(<DocsPage />);
    const steps = within(document.getElementById("first-review") as HTMLElement).getAllByRole(
      "listitem",
    );
    expect(steps.length).toBeGreaterThanOrEqual(5);
    expect(screen.getByRole("table", { name: "Parts of a Revio line" })).toBeInTheDocument();
  });

  it("gives a CI recipe that fetches history and blocks on errors", () => {
    const { container } = render(<DocsPage />);
    const ci = container.querySelector("#ci")?.textContent ?? "";
    expect(ci).toContain("fetch-depth: 0");
    expect(ci).toContain("revio review --base origin/");
    expect(ci).toContain("--block-on error");
    expect(ci).toContain("secrets.GEMINI_API_KEY");
  });

  it("explains the CLI's real messages", () => {
    render(<DocsPage />);
    const table = screen.getByRole("table", { name: "Messages and fixes" });
    for (const msg of [
      "Revio needs a git repository.",
      "Set GEMINI_API_KEY to use Revio.",
      "No changes to review.",
      "Gemini rate limit reached. Wait a minute and try again.",
    ]) {
      expect(within(table).getByText(msg)).toBeInTheDocument();
    }
  });
});
