import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ToolsSection } from "@/modules/landing/components/tools-section";

describe("ToolsSection", () => {
  it("walks through save, commit and pull request in order", () => {
    render(<ToolsSection />);
    const steps = within(
      screen.getByRole("list", { name: "How Revio reviews a change" }),
    ).getAllByRole("listitem");
    expect(steps.map((s) => within(s).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "You save: Revio checks it in your terminal",
      "You commit: Revio marks it in your editor",
      "You open a pull request: Revio comments on GitHub",
    ]);
  });

  it("explains in words what each sample shows", () => {
    const { container } = render(<ToolsSection />);
    const captions = [...container.querySelectorAll("figure figcaption")].map((c) => c.textContent);
    expect(captions).toHaveLength(3);
    for (const caption of captions) expect(caption?.length ?? 0).toBeGreaterThan(40);
  });
});
