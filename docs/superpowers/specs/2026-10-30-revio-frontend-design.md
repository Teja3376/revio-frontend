# Revio Frontend Design

The website for Revio at `revio.charanteja.site`: a public landing page and a signed-in dashboard for the GitHub App. It lives in this repo (`github.com/Teja3376/revio-frontend`). Workspace rules in `../../../../DESIGN.md` (Hallmark floor, fonts, hero component) still apply; this document settles that file's open decisions and adds structure.

Marked _(my call)_ = decided by Claude, owner may override. Everything else is the owner's decision.

## Why

Revio reviews code in three places (CLI, VS Code, GitHub PRs). The site has two jobs:
1. Show a developer in a few seconds what Revio is and get them to sign in or install the CLI.
2. After sign-in, let them manage repos where the GitHub App is installed and read past PR reviews.

Success: the landing page feels designed, not generated (passes the Hallmark check), and the dashboard is ready to plug into the real API when Phase 3 backend lands, with no rewrite.

## Goals / non-goals / anti-goals

- **Goals:** landing page with parallax hero; dashboard pages `/repos`, `/reviews`, `/reviews/[id]`, `/settings`; GitHub sign-in via Supabase; domain-driven folder structure.
- **Non-goals (v1):** billing, charts, teams, email, a separate overview/stats page, light theme.
- **Anti-goals:** invented numbers, testimonials or logos; purple-to-blue gradients; fake browser windows; sample data that could ship to production looking real; any page that hides content when JS is off or motion is reduced.

## Stack

Next.js (latest, App Router) + TypeScript strict, Tailwind CSS v4, shadcn/ui, TanStack Query, Supabase Auth via `@supabase/ssr`, GSAP + ScrollTrigger + `lenis` (hero only), zod at the API boundary.
_(my call, matching `revio-backend`)_: pnpm, Node ≥ 22.12, Biome for lint/format, vitest + Testing Library for tests.

## Folder structure (owner's choice: domain-driven, module based)

```
src/
├── app/                          routes only
│   ├── layout.tsx                fonts, theme tokens, providers
│   ├── page.tsx                  → <LandingPage /> from @/modules/landing
│   ├── auth/callback/route.ts    Supabase GitHub OAuth callback
│   └── (dashboard)/
│       ├── layout.tsx            auth guard + dashboard shell
│       ├── repos/page.tsx        → <ReposPage />
│       ├── reviews/page.tsx      → <ReviewsPage />
│       ├── reviews/[id]/page.tsx → <ReviewDetailPage id={id} />
│       └── settings/page.tsx     → <SettingsPage />
├── modules/
│   ├── landing/    pages/, components/ (hero, tools, install), index.ts
│   ├── auth/       sign-in button, session hook, guard, index.ts
│   ├── dashboard/  shell (sidebar/nav), index.ts          (my call)
│   ├── repos/      pages/, components/, api/, schemas.ts, index.ts
│   ├── reviews/    pages/, components/, api/, schemas.ts, index.ts
│   └── settings/   pages/, components/, index.ts
├── components/ui/                shadcn components + parallax-scrolling.tsx
└── lib/                          supabase clients, query client, api fetcher, utils
```

Rules:
- Every `app/**/page.tsx` only imports a page component from a module's `index.ts` and renders it (passing route params). No logic, no markup.
- Modules import other modules only through their `index.ts`. Shared code lives in `components/ui` and `lib`.
- Each module keeps its zod schemas and types next to its API calls (`schemas.ts`). _(my call: `@revio/types` is private and unpublished, so the frontend mirrors the shapes it needs from the backend spec.)_

## Look

**Tone** _(my call, from the owner's palette)_: dark, warm, calm. A workshop at night: technical but not neon.

**Palette (owner's, exact values):** each with steps 100–900, DEFAULT = 500. Put all 45 values in the Tailwind theme, then map semantic tokens.

| Name          | 100     | 200     | 300     | 400     | 500     | 600     | 700     | 800     | 900     |
| ------------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| coffee_bean   | #030103 | #050206 | #080309 | #0a050c | #0d060f | #4a2255 | #863e9b | #b573c7 | #dab9e3 |
| jet_black     | #060807 | #0c100f | #121816 | #19211d | #1e2824 | #445b52 | #6a8d7f | #9bb4aa | #cdd9d4 |
| brown_bark    | #130c05 | #25180a | #38240e | #4b3013 | #5d3c18 | #9c6428 | #cf8c44 | #dfb282 | #efd9c1 |
| dim_grey      | #181514 | #2f2b28 | #47403d | #5f5651 | #766b65 | #948881 | #afa6a1 | #cac3c0 | #e4e1e0 |
| rich_mahogany | #070000 | #0e0000 | #150000 | #1d0000 | #230000 | #830000 | #e10000 | #ff4141 | #ffa0a0 |

Semantic tokens _(my call)_:

| Token              | Value                       | Use                                                      |
| ------------------ | --------------------------- | -------------------------------------------------------- |
| `--bg`             | coffee_bean 500 `#0d060f`   | page background                                          |
| `--surface`        | jet_black 400 `#19211d`     | panels, table rows hover                                 |
| `--surface-raised` | jet_black 500 `#1e2824`     | dialogs, popovers                                        |
| `--border`         | dim_grey 300 `#47403d`      | dividers, inputs                                         |
| `--text`           | dim_grey 900 `#e4e1e0`      | body text                                                |
| `--text-muted`     | dim_grey 700 `#afa6a1`      | secondary text (500 fails contrast on bg)                |
| `--accent`         | brown_bark 700 `#cf8c44`    | primary buttons, links, focus ring                       |
| `--accent-fg`      | coffee_bean 500 `#0d060f`   | text on accent                                           |
| `--danger`         | rich_mahogany 800 `#ff4141` | severity error, security, destructive                    |
| `--warning`        | brown_bark 800 `#dfb282`    | severity warning                                         |
| `--info`           | jet_black 800 `#9bb4aa`     | severity info                                            |
| `--diff-add`       | jet_black 700 `#6a8d7f`     | diff additions in hero/samples                           |
| `--diff-del`       | rich_mahogany 600 `#830000` | diff deletions                                           |
| `--highlight`      | coffee_bean 800 `#b573c7`   | at most one small detail per screen; never in a gradient |

Text pairs must meet WCAG AA (4.5:1 body, 3:1 large text/UI).

**Fonts (owner's):** Poppins (400/500/600) for everything; Edu NSW ACT Cursive only for the hero headline, the wordmark and at most two section headings. Code and terminal samples also use Poppins.

**Logo** _(my call)_: wordmark "revio" in Edu NSW ACT Cursive, `--accent` color. Favicon: a lowercase "r" in the same font on `--bg`, as SVG.

## Landing page `/`

Max ~80 words per screen; content width capped (~1120px) and centered.

1. **Header:** wordmark left; "Sign in with GitHub" right (text button).
2. **Hero** (Osmo parallax, see DESIGN.md for behavior and cleanup):
   - Headline: "Review smarter. Ship confidently." (Edu NSW ACT Cursive)
   - Sentence: "AI code review in your terminal, editor and pull requests."
   - Primary action _(my call)_: **Sign in with GitHub** (accent button). Secondary: copy-to-clipboard `npm i -g @revio/cli` (shows "Copied" on click).
   - Headline, sentence and both actions visible at 1280×800 without scrolling.
   - Component _(my call)_: the original Osmo snippet isn't in the workspace, so `parallax-scrolling.tsx` is rewritten from Osmo's pattern (`[data-parallax-layers]` container, `[data-parallax-layer]` children, one GSAP timeline scrubbed by ScrollTrigger, Lenis driving the scroll) to the behavior DESIGN.md specifies.
   - Layers _(owner: "generate it yourself")_: four hand-made SVG layers, no stock images. Back to front: faint rows of code lines (10% speed); offset diff blocks with `--diff-add` / `--diff-del` edges (40%); the headline layer (55%); review-comment chips with `--accent` wavy underlines (70%). The layer→speed pairing is the builder's to tune as long as the title stays readable.
   - Reduced motion: no scrub, no Lenis; layers static. JS off: the hero renders as a static stack, fully readable.
3. **Three tools**, one row each, each with a real sample (not a fake window frame):
   - CLI: a terminal-style block with real `revio review` output (copy from the CLI's actual formatter in `revio-backend/packages/cli`).
   - VS Code: a code snippet with a severity underline and the "Apply Revio fix" quick-fix label.
   - GitHub: one inline PR comment and one summary comment (summary + risk + issue counts by severity). _(my call)_: the backend's comment formatter isn't built, so this page defines the format: inline = severity + category, message, optional suggestion block; summary = "Revio review", risk, one-paragraph summary, counts. The Phase 3 backend formatter must match it (note added to the backend spec when that phase starts).
     Each row states when it runs and its depth (quick / normal / full).
4. **Install:** CLI command (copyable), VS Code (Marketplace link placeholder until published), GitHub App (sign in → install).
5. **Footer:** wordmark, © line. _(my call)_: no GitHub link while the repos are private; add it when they go public.

## Dashboard

All dashboard routes require sign-in. Signed-out visitors are redirected to `/`. After sign-in the user lands on `/repos` _(my call)_.

**Shell** _(my call)_: left sidebar on ≥ md (wordmark, Repos, Reviews, Settings, user avatar + login at the bottom); top bar with menu on mobile.

- **`/repos`:** list of repos where the App is installed: full name, enabled switch, depth select (quick/normal/full, default full), ignore globs (editable list of text inputs). Changes save per repo with optimistic update and an inline error if the save fails. Empty state: one sentence + "Install GitHub App" button (link to the App's install URL from env).
- **`/reviews`:** table: repo, PR (#number + title), status, issue count, time (relative, full date on hover). Filter by repo. Pagination by page (`?repo=&page=`). Empty state explains reviews appear when a PR is opened.
- **`/reviews/[id]`:** PR title + link to the PR on GitHub, status, risk, summary, then issues grouped by file: line (or range), severity, category, message, suggestion (as a code block). Error state shows the review's `error` text when status is failed.
- **`/settings`:** avatar, GitHub login, sign out.

Every list has loading (skeleton), empty and error states.

## Data

Endpoints come from the backend spec (`revio-backend/docs/superpowers/specs/2026-10-30-revio-design.md` §4.4). Requests send the Supabase JWT as `Authorization: Bearer`. Every response is parsed with zod; a parse failure shows the error state, never broken UI.

JSON shapes _(my call; the backend is unbuilt and must follow these)_: camelCase fields, ids are uuid strings, times ISO 8601.

```
GET /repos            → { items: Repo[] }
Repo                  = { id, fullName, enabled, depth: "quick"|"normal"|"full", ignoreGlobs: string[] }
PATCH /repos/:id      body: Partial<{ enabled, depth, ignoreGlobs }>  → Repo
GET /reviews?repo=<repoId>&page=<n, 1-based>
                      → { items: ReviewSummary[], page, pageSize, total }
ReviewSummary         = { id, repoId, repoFullName, prNumber, prTitle, prUrl,
                          status: "queued"|"running"|"done"|"failed"|"skipped",
                          issueCount, startedAt, finishedAt|null }
GET /reviews/:id      → ReviewSummary & { summary|null, risk: "low"|"medium"|"high"|null,
                          error|null, issues: Issue[] }
Issue                 = { id, file, line, endLine?, severity: "error"|"warning"|"info",
                          category: "bug"|"security"|"performance"|"quality"|"style",
                          message, suggestion? }
Errors                = non-2xx with { message }
```
Pagination UI shows page numbers from `total / pageSize`.

**Until the API exists** _(my call)_: `lib/api.ts` is the single swap point. When `NEXT_PUBLIC_API_URL` is unset **and** `NODE_ENV=development`, it returns sample data from `lib/sample-data.ts` (clearly fake names like `example/repo`), and the shell shows a visible "Sample data" badge. In production with no API URL, dashboard requests fail into the normal error state. Sample data never ships, and `pnpm build` still passes in CI without an API.

**Auth:** Supabase GitHub provider (configured later with the GitHub App's client id/secret, per backend spec). Session handled with `@supabase/ssr`; guard in the `(dashboard)` layout plus Next middleware/proxy for the redirect. Sending the provider token to the API at sign-in is Phase 3 backend work; the frontend leaves one clearly named hook for it.
_(my call)_: when Supabase env vars are unset **and** `NODE_ENV=development`, the guard lets you in as a sample user so the dashboard can be built and checked before keys exist. Never in production.

Env (`.env.example` shipped, real values only in gitignored `.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL`.

## Quality

- TDD for logic (schemas, api fetcher, sample-data switch, guard, copy button, grouping issues by file). Visual layout is checked by eye and Hallmark, not snapshot tests.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` all pass.
- Hallmark floor from DESIGN.md: tokens only, transform/opacity animations, `:focus-visible` everywhere, `overflow-x: clip`, no eyebrows/all-caps labels, no cards in cards, no emoji icons.
- **Final step (owner's request):** run the Hallmark skill against the landing page and dashboard, fix what it flags, report what changed.
- Conventional commits with the co-author line. No push without the owner saying so.

## Left to the builder

Component breakdown inside modules, exact spacing/type scale, SVG layer artwork details, shadcn components chosen, copy for empty states and section text (within the word limits), skeleton design, and the test file layout.
