import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WhySection } from "@/modules/landing/components/why-section";

describe("WhySection", () => {
  it("lists what makes Revio different, each with a reason", () => {
    render(<WhySection />);
    const section = screen.getByRole("region", { name: /why revio/i });
    const points = within(section).getAllByRole("listitem");
    expect(points.length).toBeGreaterThanOrEqual(5);
    for (const point of points) {
      expect(within(point).getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(point.querySelector("p")?.textContent?.length ?? 0).toBeGreaterThan(40);
    }
  });

  it("names no other product", () => {
    const { container } = render(<WhySection />);
    expect(container.textContent).not.toMatch(/coderabbit|copilot|sourcery|codacy/i);
  });
});
