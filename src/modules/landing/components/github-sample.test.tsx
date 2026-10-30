import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GithubSample } from "./github-sample";

describe("GithubSample", () => {
  it("lists risk and counts without middle-dot joins", () => {
    const { container } = render(<GithubSample />);
    expect(screen.getByText("1 error, 1 warning, 1 info")).toBeInTheDocument();
    expect(container.textContent).not.toContain("·");
  });
});
