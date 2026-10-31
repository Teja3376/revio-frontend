import type { z } from "zod";
import { ApiError } from "./api-error";
import { sampleRequest } from "./sample-data";
import { SAMPLE_MODE } from "./sample-mode";
import { createBrowserSupabase } from "./supabase/client";

export { ApiError, SAMPLE_MODE };

type Method = "GET" | "POST" | "PATCH";
type Options = {
  baseUrl: string;
  getToken: () => Promise<string | undefined>;
  fetch: typeof fetch;
  /** Answer from in-memory sample data instead of the network. */
  sample: boolean;
};

export function createApi({ baseUrl, getToken, fetch: fetchImpl, sample }: Options) {
  async function call(method: Method, path: string, body?: unknown): Promise<unknown> {
    if (sample) return sampleRequest(method, path, body);
    if (!baseUrl) throw new ApiError("The dashboard isn’t connected to the Revio API yet.");

    const token = await getToken();
    let res: Response;
    try {
      res = await fetchImpl(`${baseUrl}${path}`, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError("Couldn’t reach Revio. Check your connection and try again.");
    }
    const data = await res.json().catch(() => undefined);
    if (!res.ok) {
      const message = (data as { message?: unknown } | undefined)?.message;
      throw new ApiError(
        typeof message === "string" ? message : `Request failed (${res.status}).`,
        res.status,
      );
    }
    return data;
  }

  return {
    async request<T>(
      path: string,
      schema: z.ZodType<T>,
      init: { method?: Method; body?: unknown } = {},
    ) {
      const parsed = schema.safeParse(await call(init.method ?? "GET", path, init.body));
      if (!parsed.success)
        throw new ApiError("Revio sent an unexpected reply. Try reloading the page.");
      return parsed.data;
    },
  };
}

process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL;

export const api = createApi({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  getToken: async () =>
    (await createBrowserSupabase().auth.getSession()).data.session?.access_token,
  fetch: (...args) => fetch(...args),
  sample: SAMPLE_MODE,
});
