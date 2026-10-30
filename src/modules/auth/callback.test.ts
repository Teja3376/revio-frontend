import { beforeEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSession = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: async () => ({ auth: { exchangeCodeForSession } }),
}));

import { handleAuthCallback } from "./callback";

const call = (query: string) =>
  handleAuthCallback(new Request(`https://revio.test/auth/callback${query}`));

beforeEach(() => {
  exchangeCodeForSession.mockReset();
  exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });
});

describe("handleAuthCallback", () => {
  it("exchanges the code and sends the user to /repos", async () => {
    const res = await call("?code=abc");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://revio.test/repos");
  });

  it("honors a same-site next path", async () => {
    const res = await call("?code=abc&next=/reviews");
    expect(res.headers.get("location")).toBe("https://revio.test/reviews");
  });

  it.each([
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "reviews",
    "/\t/evil.com",
    "/\n/evil.com",
  ])("ignores an unsafe next %s", async (next) => {
    const res = await call(`?code=abc&next=${encodeURIComponent(next)}`);
    expect(res.headers.get("location")).toBe("https://revio.test/repos");
  });

  it("sends the user back with auth_error when there is no code", async () => {
    const res = await call("?error=access_denied");
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("https://revio.test/?auth_error=1");
  });

  it("sends the user back with auth_error when the exchange throws", async () => {
    exchangeCodeForSession.mockRejectedValue(new Error("network down"));
    const res = await call("?code=abc");
    expect(res.headers.get("location")).toBe("https://revio.test/?auth_error=1");
  });

  it("sends the user back with auth_error when the exchange fails", async () => {
    exchangeCodeForSession.mockResolvedValue({ data: {}, error: new Error("bad code") });
    const res = await call("?code=abc");
    expect(res.headers.get("location")).toBe("https://revio.test/?auth_error=1");
  });
});
