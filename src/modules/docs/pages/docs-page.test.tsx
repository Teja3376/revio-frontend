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
});
