import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, createApi } from "@/lib/api";

const Thing = z.object({ id: z.string() });
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("createApi", () => {
  it("sends the sign-in token and validates the response", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ id: "1" }));
    const api = createApi({
      baseUrl: "https://api.test",
      getToken: async () => "tok",
      fetch,
      sample: false,
    });
    expect(await api.request("/things/1", Thing)).toEqual({ id: "1" });
    expect(fetch).toHaveBeenCalledWith("https://api.test/things/1", {
      method: "GET",
      headers: { Authorization: "Bearer tok", "Content-Type": "application/json" },
      body: undefined,
    });
  });

  it("sends a JSON body", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ id: "1" }));
    const api = createApi({
      baseUrl: "https://api.test",
      getToken: async () => "tok",
      fetch,
      sample: false,
    });
    await api.request("/things/1", Thing, { method: "PATCH", body: { enabled: false } });
    expect(fetch.mock.calls[0]?.[1].body).toBe('{"enabled":false}');
  });

  it("turns an error reply into an ApiError with the server's message", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ message: "Repository not found." }, 404));
    const api = createApi({
      baseUrl: "https://api.test",
      getToken: async () => "tok",
      fetch,
      sample: false,
    });
    const err = await api.request("/x", Thing).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 404, message: "Repository not found." });
  });

  it("rejects a response that doesn't match the schema", async () => {
    const fetch = vi.fn().mockResolvedValue(json({ nope: true }));
    const api = createApi({
      baseUrl: "https://api.test",
      getToken: async () => "tok",
      fetch,
      sample: false,
    });
    await expect(api.request("/x", Thing)).rejects.toThrow(/unexpected reply/i);
  });

  it("explains a network failure", async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError("fetch failed"));
    const api = createApi({
      baseUrl: "https://api.test",
      getToken: async () => "tok",
      fetch,
      sample: false,
    });
    await expect(api.request("/x", Thing)).rejects.toThrow(/couldn’t reach Revio/i);
  });

  it("fails clearly when no API is configured outside sample mode", async () => {
    const api = createApi({
      baseUrl: "",
      getToken: async () => "tok",
      fetch: vi.fn(),
      sample: false,
    });
    await expect(api.request("/x", Thing)).rejects.toThrow(/isn’t connected/i);
  });

  it("answers from sample data in sample mode, without the network", async () => {
    const fetch = vi.fn();
    const api = createApi({ baseUrl: "", getToken: async () => undefined, fetch, sample: true });
    const repos = await api.request(
      "/repos",
      z.object({ items: z.array(z.object({ fullName: z.string() })) }),
    );
    expect(repos.items.length).toBeGreaterThan(0);
    expect(fetch).not.toHaveBeenCalled();
  });
});
