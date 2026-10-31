import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { guardDashboard } from "./guard";

const req = (path: string) => new NextRequest(`https://revio.test${path}`);

describe("guardDashboard", () => {
  it("sends a signed-out visitor home with a sign-in prompt", async () => {
    const res = await guardDashboard(req("/repos"), { sample: false, getUser: async () => null });
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://revio.test/?signin=required");
  });

  it("lets a signed-in user through", async () => {
    const res = await guardDashboard(req("/reviews/abc"), {
      sample: false,
      getUser: async () => ({ id: "u" }),
    });
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets everyone through in local sample mode", async () => {
    const res = await guardDashboard(req("/settings"), { sample: true, getUser: async () => null });
    expect(res.headers.get("location")).toBeNull();
  });
});
