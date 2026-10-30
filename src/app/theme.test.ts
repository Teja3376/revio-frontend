import { globSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

// Owner's palette, steps 100–900 for each color.
const PALETTE = [
  "#030103",
  "#050206",
  "#080309",
  "#0a050c",
  "#0d060f",
  "#4a2255",
  "#863e9b",
  "#b573c7",
  "#dab9e3",
  "#060807",
  "#0c100f",
  "#121816",
  "#19211d",
  "#1e2824",
  "#445b52",
  "#6a8d7f",
  "#9bb4aa",
  "#cdd9d4",
  "#130c05",
  "#25180a",
  "#38240e",
  "#4b3013",
  "#5d3c18",
  "#9c6428",
  "#cf8c44",
  "#dfb282",
  "#efd9c1",
  "#181514",
  "#2f2b28",
  "#47403d",
  "#5f5651",
  "#766b65",
  "#948881",
  "#afa6a1",
  "#cac3c0",
  "#e4e1e0",
  "#070000",
  "#0e0000",
  "#150000",
  "#1d0000",
  "#230000",
  "#830000",
  "#e10000",
  "#ff4141",
  "#ffa0a0",
];

describe("theme", () => {
  it.each(PALETTE)("defines palette value %s", (hex) => {
    expect(css.toLowerCase()).toContain(hex);
  });

  it("maps the semantic tokens to the owner's palette", () => {
    expect(css).toMatch(/--color-bg:\s*var\(--color-coffee_bean-500\)/);
    expect(css).toMatch(/--color-accent:\s*var\(--color-brown_bark-700\)/);
    expect(css).toMatch(/--color-coffee_bean-500:\s*#0d060f/);
    expect(css).toMatch(/--color-brown_bark-700:\s*#cf8c44/);
  });

  it("keeps hex colors out of every other source file", () => {
    const files = globSync("src/**/*.{ts,tsx,css}").filter(
      (f) => !f.endsWith(".test.ts") && !f.endsWith(".test.tsx") && !f.endsWith("globals.css"),
    );
    const offenders = files.filter((f) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
