/**
 * For vi.mock("@/lib/api", (importOriginal) => sampleApiModule(importOriginal)):
 * the real client, answering from sample data. Uses importOriginal so the mock never imports itself.
 */
export async function sampleApiModule(importOriginal: () => Promise<unknown>) {
  const actual = (await importOriginal()) as typeof import("@/lib/api");
  return {
    ...actual,
    SAMPLE_MODE: true,
    api: actual.createApi({ baseUrl: "", getToken: async () => undefined, fetch, sample: true }),
  };
}
