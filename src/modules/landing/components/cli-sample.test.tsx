import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SAMPLE_ISSUES } from "../sample-issues";
import { CliSample, formatCliLine } from "./cli-sample";

describe("formatCliLine", () => {
  it("matches the real CLI formatter without color", () => {
    expect(
      formatCliLine({
        file: "src/api/users.ts",
        line: 42,
        severity: "error",
        category: "security",
        message: "User input is passed to the SQL query unescaped.",
        suggestion: "Use a parameterized query.",
      }),
    ).toEqual({
      head: "src/api/users.ts:42  ✖ error  [security] User input is passed to the SQL query unescaped.",
      suggestion: "    → Use a parameterized query.",
    });
  });

  it("uses the CLI's icons for warning and info, and omits a missing suggestion", () => {
    const base = { file: "a.ts", line: 1, category: "bug" as const, message: "m" };
    expect(formatCliLine({ ...base, severity: "warning" }).head).toBe("a.ts:1  ⚠ warning  [bug] m");
    expect(formatCliLine({ ...base, severity: "info" })).toEqual({
      head: "a.ts:1  ℹ info  [bug] m",
    });
  });
});

describe("CliSample", () => {
  it("shows the prompt and one line per issue, sorted by file then line", () => {
    render(<CliSample />);
    expect(screen.getByText("revio review")).toBeInTheDocument();
    const heads = [...SAMPLE_ISSUES]
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
      .map((i) => formatCliLine(i).head);
    const rendered = screen.getAllByTestId("cli-head").map((n) => n.textContent);
    expect(rendered).toEqual(heads);
  });
});
