import { beforeEach, describe, expect, it } from "vitest";
import { resetSampleData, sampleRequest } from "@/lib/sample-data";

beforeEach(resetSampleData);

describe("sampleRequest", () => {
  it("serves the signed-in sample user", async () => {
    expect(await sampleRequest("GET", "/me")).toMatchObject({ githubLogin: "sample-user" });
  });

  it("saves repo settings for the rest of the session", async () => {
    const { items } = (await sampleRequest("GET", "/repos")) as { items: { id: string }[] };
    const id = items[0]?.id as string;
    await sampleRequest("PATCH", `/repos/${id}`, { enabled: false });
    const after = (await sampleRequest("GET", "/repos")) as {
      items: { id: string; enabled: boolean }[];
    };
    expect(after.items.find((r) => r.id === id)?.enabled).toBe(false);
  });

  it("filters reviews by repo and pages them", async () => {
    const all = (await sampleRequest("GET", "/reviews?page=1")) as {
      total: number;
      pageSize: number;
    };
    expect(all.pageSize).toBe(20);
    const { items } = (await sampleRequest("GET", "/repos")) as { items: { id: string }[] };
    const one = (await sampleRequest("GET", `/reviews?repo=${items[0]?.id}&page=1`)) as {
      items: { repoId: string }[];
      total: number;
    };
    expect(one.items.every((r) => r.repoId === items[0]?.id)).toBe(true);
    expect(one.total).toBeLessThanOrEqual(all.total);
  });

  it("returns a review with issues, and 404s an unknown one", async () => {
    const { items } = (await sampleRequest("GET", "/reviews?page=1")) as {
      items: { id: string }[];
    };
    expect(await sampleRequest("GET", `/reviews/${items[0]?.id}`)).toHaveProperty("issues");
    await expect(sampleRequest("GET", "/reviews/nope")).rejects.toMatchObject({ status: 404 });
  });

  it("uses clearly fake names", async () => {
    const { items } = (await sampleRequest("GET", "/repos")) as { items: { fullName: string }[] };
    expect(items.every((r) => r.fullName.startsWith("example/"))).toBe(true);
  });
});
