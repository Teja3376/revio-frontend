import { ApiError } from "./api-error";

// Clearly fake data for local development without the API (see SAMPLE_MODE in api.ts).

type Repo = {
  id: string;
  fullName: string;
  enabled: boolean;
  depth: "quick" | "normal" | "full";
  ignoreGlobs: string[];
};

const REPOS: Repo[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    fullName: "example/web-app",
    enabled: true,
    depth: "full",
    ignoreGlobs: [],
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    fullName: "example/api-server",
    enabled: true,
    depth: "full",
    ignoreGlobs: ["**/*.snap"],
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    fullName: "example/cli-tool",
    enabled: false,
    depth: "normal",
    ignoreGlobs: [],
  },
];

const issue = (n: number, over: Record<string, unknown>) => ({
  id: `00000000-0000-4000-9000-${String(n).padStart(12, "0")}`,
  ...over,
});

const REVIEWS = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    repoId: REPOS[0]?.id,
    repoFullName: "example/web-app",
    prNumber: 42,
    prTitle: "Add user lookup endpoint",
    prUrl: "https://github.com/example/web-app/pull/42",
    status: "done",
    issueCount: 2,
    startedAt: "2026-10-30T14:02:00.000Z",
    finishedAt: "2026-10-30T14:02:41.000Z",
    summary:
      "Adds a user lookup endpoint. The query is built from request input, and a missing user crashes the handler.",
    risk: "high",
    error: null,
    issues: [
      issue(1, {
        file: "src/api/users.ts",
        line: 42,
        severity: "error",
        category: "security",
        message: "User input is passed to the SQL query unescaped.",
        suggestion: 'const rows = await db.query("SELECT * FROM users WHERE id = $1", [id]);',
      }),
      issue(2, {
        file: "src/api/users.ts",
        line: 43,
        severity: "warning",
        category: "bug",
        message: "rows[0] is undefined when no user matches.",
      }),
    ],
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    repoId: REPOS[1]?.id,
    repoFullName: "example/api-server",
    prNumber: 17,
    prTitle: "Cache session lookups",
    prUrl: "https://github.com/example/api-server/pull/17",
    status: "done",
    issueCount: 1,
    startedAt: "2026-10-29T09:15:00.000Z",
    finishedAt: "2026-10-29T09:15:33.000Z",
    summary: "Adds an in-memory cache for sessions. Entries never expire.",
    risk: "medium",
    error: null,
    issues: [
      issue(3, {
        file: "src/sessions/cache.ts",
        line: 12,
        endLine: 14,
        severity: "warning",
        category: "performance",
        message: "The cache grows without limit; old sessions are never evicted.",
      }),
    ],
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    repoId: REPOS[0]?.id,
    repoFullName: "example/web-app",
    prNumber: 41,
    prTitle: "Update copy on the pricing page",
    prUrl: "https://github.com/example/web-app/pull/41",
    status: "done",
    issueCount: 0,
    startedAt: "2026-10-28T18:40:00.000Z",
    finishedAt: "2026-10-28T18:40:12.000Z",
    summary: "Text-only change to the pricing page.",
    risk: "low",
    error: null,
    issues: [],
  },
  {
    id: "00000000-0000-4000-a000-000000000004",
    repoId: REPOS[1]?.id,
    repoFullName: "example/api-server",
    prNumber: 16,
    prTitle: "Switch to the new payments SDK",
    prUrl: "https://github.com/example/api-server/pull/16",
    status: "failed",
    issueCount: 0,
    startedAt: "2026-10-27T11:05:00.000Z",
    finishedAt: "2026-10-27T11:06:00.000Z",
    summary: null,
    risk: null,
    error: "Gemini did not respond in time. Try again.",
    issues: [],
  },
];

let repos: Repo[] = [];
export function resetSampleData() {
  repos = REPOS.map((r) => ({ ...r, ignoreGlobs: [...r.ignoreGlobs] }));
}
resetSampleData();

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export async function sampleRequest(
  method: string,
  path: string,
  body?: unknown,
): Promise<unknown> {
  const url = new URL(path, "https://sample.local");
  const parts = url.pathname.split("/").filter(Boolean);

  if (method === "GET" && url.pathname === "/me") {
    return {
      id: "00000000-0000-4000-8000-0000000000aa",
      githubLogin: "sample-user",
      avatarUrl: null,
    };
  }
  if (method === "POST" && url.pathname === "/me/github-link") return sampleRequest("GET", "/me");
  if (method === "GET" && url.pathname === "/repos") return { items: clone(repos) };
  if (method === "PATCH" && parts[0] === "repos" && parts[1]) {
    const repo = repos.find((r) => r.id === parts[1]);
    if (!repo) throw new ApiError("Repository not found.", 404);
    Object.assign(repo, body);
    return clone(repo);
  }
  if (method === "GET" && url.pathname === "/reviews") {
    const page = Number(url.searchParams.get("page") ?? 1);
    const repo = url.searchParams.get("repo");
    const all = REVIEWS.filter((r) => !repo || r.repoId === repo);
    const items = all
      .slice((page - 1) * 20, page * 20)
      .map(({ summary, risk, error, issues, ...s }) => s);
    return clone({ items, page, pageSize: 20, total: all.length });
  }
  if (method === "GET" && parts[0] === "reviews" && parts[1]) {
    const review = REVIEWS.find((r) => r.id === parts[1]);
    if (!review) throw new ApiError("Review not found.", 404);
    return clone(review);
  }
  throw new ApiError(`No sample data for ${method} ${url.pathname}.`, 404);
}
