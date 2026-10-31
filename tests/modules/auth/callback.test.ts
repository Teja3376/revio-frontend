import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSession = vi.fn();
const fetchMock = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: async () => ({ auth: { exchangeCodeForSession } }),
}));

import { handleAuthCallback } from "@/modules/auth/callback";

const call = (query: string) =>
  handleAuthCallback(new Request(`https://revio.test/auth/callback${query}`));

const SESSION = { access_token: "supa-jwt", provider_token: "gho_123" };

beforeEach(() => {
  exchangeCodeForSession.mockReset();
  exchangeCodeForSession.mockResolvedValue({ data: { session: SESSION }, error: null });
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.test");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
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

  it("logs the provider's error description when sign-in is rejected", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    await call("?error=server_error&error_description=Error+getting+user+email");
    expect(log).toHaveBeenCalledWith(
      "[auth] sign-in rejected:",
      "server_error",
      "Error getting user email",
    );
    log.mockRestore();
  });

  it("logs why the code exchange failed", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    exchangeCodeForSession.mockResolvedValue({ data: {}, error: new Error("bad code") });
    await call("?code=abc");
    expect(log).toHaveBeenCalledWith("[auth] code exchange failed:", "bad code");
    log.mockRestore();
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

  it("links the user's GitHub installations with the provider token, once, server-side", async () => {
    await call("?code=abc");
    expect(fetchMock).toHaveBeenCalledWith("https://api.test/me/github-link", {
      method: "POST",
      headers: { Authorization: "Bearer supa-jwt", "Content-Type": "application/json" },
      body: JSON.stringify({ githubToken: "gho_123" }),
    });
  });

  it("still signs the user in when linking fails", async () => {
    fetchMock.mockRejectedValue(new Error("down"));
    const res = await call("?code=abc");
    expect(res.headers.get("location")).toBe("https://revio.test/repos");
  });

  it("skips linking when no API is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    await call("?code=abc");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
