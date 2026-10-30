# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public landing page at `/` for revio.charanteja.site, with the parallax hero, the three tools, install links, and a working "Sign in with GitHub" button.

**Architecture:** A new Next.js App Router project in `revio-frontend`, laid out by domain module. `src/app/page.tsx` only renders `<LandingPage />` from `@/modules/landing`. Sign-in lives in `@/modules/auth`. The generic parallax engine lives in `src/components/ui/parallax-scrolling.tsx`, and Revio's SVG layers live in the landing module.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, `@supabase/ssr`, GSAP 3 + ScrollTrigger, `lenis`, Biome, vitest + Testing Library + jsdom, pnpm.

**Spec:** `docs/superpowers/specs/2026-10-30-revio-frontend-design.md`, plus the workspace `../DESIGN.md` (Hallmark floor, hero behavior).

## Global Constraints

- Node ≥ 22.12, pnpm, TypeScript `strict: true`. Path alias `@/*` → `src/*`.
- `app/**/page.tsx` contains only an import from a module's `index.ts` and a render. Modules import other modules only through `index.ts`.
- Fonts: Poppins 400/500/600 for everything; Edu NSW ACT Cursive (weight 400–700) only for the wordmark, the hero headline and at most two section headings. Both via `next/font/google`. No other font families, including for code.
- All 45 palette values in the Tailwind theme, plus the semantic tokens from the spec's token table. No hex color outside `src/app/globals.css`.
- Animate only `transform` and `opacity`; never `transition: all`. Every animation has a reduced-motion fallback; content visible with JS off.
- Every interactive element has a visible `:focus-visible` ring in `--accent`. `overflow-x: clip` on `html` and `body`.
- ≤ 80 words per screen. Hero: headline "Review smarter. Ship confidently.", sentence "AI code review in your terminal, editor and pull requests.", primary "Sign in with GitHub", secondary copy `npm i -g @revio/cli`.
- No invented numbers, testimonials, logos; no eyebrows or tracked all-caps; no purple-to-blue gradients; no cards in cards; no emoji icons; no fake browser windows. `--highlight` at most once per screen.
- Content width max 1120px, centered.
- Secrets only in gitignored `.env.local`; ship `.env.example`. Conventional commits ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.

## Review Focus

1. Clipboard unavailable or denied (HTTP preview, old browser): the copy button shows "Copy failed" and the command stays selectable text. Test in Task 3.
2. `prefers-reduced-motion: reduce`: Lenis and ScrollTrigger never start; layers sit still. Test in Task 4.
3. JS off / before hydration: headline, sentence and both actions are in the server HTML and not hidden by `opacity: 0`. Test in Task 4 (render without effects) and check in Task 6 with JS disabled.
4. Navigating away and back (to `/repos` later): no leaked ScrollTriggers, ticker callbacks or a second Lenis. Test in Task 4 (unmount cleanup).
5. Sign-in failure (provider not configured yet, user cancels, missing `code`): the callback redirects to `/?auth_error=1` and the header shows "Sign-in failed. Try again." instead of crashing. Tests in Task 2.

---

### Task 1: Project scaffold, theme and fonts

**Files:**
- Create: the Next.js project in `revio-frontend/` (keep the existing `.gitignore`, `README.md`, `docs/`)
- Create: `biome.json`, `vitest.config.ts`, `vitest.setup.ts`, `.env.example`, `components.json` (shadcn), `src/lib/utils.ts` (shadcn `cn`)
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `package.json`
- Test: `src/app/theme.test.ts`

**Interfaces:**
- Produces: Tailwind color utilities `coffee_bean-100…900`, `jet_black-*`, `brown_bark-*`, `dim_grey-*`, `rich_mahogany-*`, and semantic utilities `bg`, `surface`, `surface-raised`, `border`, `text`, `text-muted`, `accent`, `accent-fg`, `danger`, `warning`, `info`, `diff-add`, `diff-del`, `highlight` (e.g. `bg-bg`, `text-text-muted`, `bg-accent`). Font utilities `font-sans` (Poppins) and `font-display` (Edu NSW ACT Cursive). Scripts `dev`, `build`, `start`, `typecheck`, `lint`, `format`, `test`.

- [ ] **Step 1:** Scaffold into a temp folder with `pnpm create next-app@latest` (TypeScript, Tailwind, App Router, `src/` dir, alias `@/*`, no ESLint), then move its files into `revio-frontend/` without overwriting `.gitignore`, `README.md` or `docs/`. Run `pnpm dev` and check that it serves `/`.
- [ ] **Step 2:** Add dev deps `@biomejs/biome vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`. Configure vitest with jsdom, the `@` alias, and `vitest.setup.ts` importing `@testing-library/jest-dom/vitest`. Biome: 2-space indent, line width 100 (match `revio-backend/biome.json`). Scripts: `typecheck` = `tsc --noEmit`, `lint` = `biome check .`, `format` = `biome check --write .`, `test` = `vitest run`.
- [ ] **Step 3:** Run `pnpm dlx shadcn@latest init` (dark only, CSS variables). Then replace its generated color variables with Revio's tokens, mapping shadcn's names (`--background`, `--foreground`, `--primary`, `--primary-foreground`, `--muted-foreground`, `--border`, `--ring`, `--card`, `--popover`, `--destructive`) onto the semantic tokens.
- [ ] **Step 4: Write the failing test** `src/app/theme.test.ts`: it reads `globals.css` as text and asserts:
  - it contains all 45 hex values from the spec's palette table (put them in the test as an array);
  - `--accent: ` is followed by the brown_bark 700 value `#cf8c44`, and `--bg` by `#0d060f`;
  - no file under `src/` other than `globals.css` contains `/#[0-9a-fA-F]{3,8}\b/` (glob `src/**/*.{ts,tsx,css}`, skipping `*.test.ts`).
- [ ] **Step 5:** Run `pnpm test`. Expected: FAIL (palette values missing).
- [ ] **Step 6:** In `globals.css`, use `@theme` with `--color-coffee_bean-100…900` for all 45 values, and semantic `--color-bg: var(--color-coffee_bean-500)` etc. per the spec's table. Add `html, body { overflow-x: clip; background: var(--color-bg); color: var(--color-text); }`, a global `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`, and `@media (prefers-reduced-motion: reduce)` disabling `scroll-behavior: smooth`. In `layout.tsx`, load `Poppins({ weight: ["400","500","600"], variable: "--font-poppins" })` and `Edu_NSW_ACT_Cursive({ weight: "variable", variable: "--font-edu" })` (if `weight: "variable"` is rejected, pass `["400","500","600","700"]`), wire `--font-sans` / `--font-display` in `@theme`, and set `<html lang="en" className="dark">`. Metadata: title "Revio · Review smarter. Ship confidently.", description = the hero sentence.
- [ ] **Step 7:** Run `pnpm test && pnpm typecheck && pnpm lint && pnpm build`. Expected: all pass.
- [ ] **Step 8:** `.env.example` with `NEXT_PUBLIC_SUPABASE_URL=`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=`, `NEXT_PUBLIC_API_URL=`, `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL=`. Check `git status` doesn't show `.env.local`. Commit `chore: Next.js scaffold, Revio theme and fonts`.

### Task 2: Auth module: sign in with GitHub + callback

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Create: `src/modules/auth/components/sign-in-button.tsx`, `src/modules/auth/callback.ts`, `src/modules/auth/index.ts`
- Create: `src/app/auth/callback/route.ts`
- Test: `src/modules/auth/sign-in-button.test.tsx`, `src/modules/auth/callback.test.ts`

**Interfaces:**
- Produces: `createBrowserSupabase(): SupabaseClient` and `createServerSupabase(): Promise<SupabaseClient>` (the `@supabase/ssr` cookie pattern for Next 16, using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- Produces: `<SignInButton variant?: "primary" | "text" />` from `@/modules/auth`. Produces `handleAuthCallback(request: Request): Promise<Response>` from `@/modules/auth`; `app/auth/callback/route.ts` is `export const GET = handleAuthCallback;`.

- [ ] **Step 1:** `pnpm add @supabase/ssr @supabase/supabase-js`. Write both clients (the server one uses `cookies()` from `next/headers`).
- [ ] **Step 2: Write the failing tests** (mock `@/lib/supabase/client` and `@/lib/supabase/server`):
  - `sign-in-button`: clicking calls `signInWithOAuth({ provider: "github", options: { redirectTo: "<origin>/auth/callback" } })`; while pending, the button is disabled and reads "Signing in…"; when it resolves `{ error }`, the button re-enables and shows the text "Sign-in failed. Try again." in an `aria-live="polite"` region.
  - `sign-in-button`: when the URL has `?auth_error=1`, the same message shows on first render.
  - `callback`: `?code=abc` + `exchangeCodeForSession` OK → 303 redirect to `/repos`; `?code=abc&next=/reviews` → `/reviews`; `next=https://evil.com` or `next=//evil.com` → `/repos` (only paths starting with a single `/`); no `code` → `/?auth_error=1`; exchange returns an error → `/?auth_error=1`.
- [ ] **Step 3:** Run `pnpm test src/modules/auth`. Expected: FAIL (modules not found).
- [ ] **Step 4:** Implement. The button is a client component. The primary variant uses the `accent` button styles from Task 1's shadcn `Button` (`pnpm dlx shadcn@latest add button`, restyled to the tokens). The text variant is an underlined `text-text` link-style button. Use the GitHub mark as an inline SVG icon (`aria-hidden`), not an emoji.
- [ ] **Step 5:** Run `pnpm test`. Expected: PASS. Commit `feat(auth): sign in with GitHub and OAuth callback`.

### Task 3: Copy-command button

**Files:**
- Create: `src/modules/landing/components/copy-command.tsx`
- Test: `src/modules/landing/components/copy-command.test.tsx`

**Interfaces:**
- Produces: `<CopyCommand command: string />` renders the command as selectable `<code>` plus a button.

- [ ] **Step 1: Write the failing tests:**
  - clicking the button calls `navigator.clipboard.writeText("npm i -g @revio/cli")`, and the button's accessible name changes from "Copy command" to "Copied" for 2 s (use fake timers);
  - when `navigator.clipboard` is undefined or `writeText` rejects, the button shows "Copy failed" and the `<code>` text is still in the document.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement. Status text goes in an `aria-live="polite"` span. Clear the timer on unmount.
- [ ] **Step 4:** Run it. Expected: PASS. Commit `feat(landing): copy command button`.

### Task 4: Parallax engine + Revio hero

**Files:**
- Create: `src/components/ui/parallax-scrolling.tsx`, `src/components/ui/parallax-scrolling.css`
- Create: `src/modules/landing/components/hero.tsx`, `src/modules/landing/components/hero-layers.tsx`
- Test: `src/components/ui/parallax-scrolling.test.tsx`, `src/modules/landing/components/hero.test.tsx`

**Interfaces:**
- Produces: `<ParallaxScrolling className?: string>{children}</ParallaxScrolling>`. Children mark layers with `data-parallax-layer="<speed 0–100>"`. The engine follows Osmo's pattern: on mount, if `matchMedia("(prefers-reduced-motion: reduce)")` doesn't match, create a `Lenis`, register `ScrollTrigger`, feed `lenis.raf` into `gsap.ticker`, and build one timeline scrubbed over the container's scroll height, moving each layer by `yPercent: speed`. On unmount: kill the ScrollTriggers it created, `gsap.ticker.remove` its callback, `lenis.destroy()`.
- Produces: `<Hero />` with four layers back to front: `CodeLinesLayer` (10), `DiffBlocksLayer` (40), the title block (55), `CommentChipsLayer` (70).

- [ ] **Step 1:** `pnpm add gsap lenis`.
- [ ] **Step 2: Write the failing tests** (mock `gsap`, `gsap/ScrollTrigger` and `lenis`; stub `matchMedia`):
  - reduced motion matches → `Lenis` is never constructed and `gsap.timeline` is never called;
  - motion allowed → `Lenis` is constructed once and `gsap.ticker.add` is called once; after `unmount()`, `lenis.destroy`, `gsap.ticker.remove` (with the same callback) and the created ScrollTrigger's `kill` are each called once;
  - `hero`: renders an `h1` with "Review smarter. Ship confidently.", the sentence, a "Sign in with GitHub" button and the `npm i -g @revio/cli` code, and none of those nodes has inline `opacity: 0` or the `hidden` attribute.
- [ ] **Step 3:** Run it. Expected: FAIL.
- [ ] **Step 4:** Implement the engine as a client component. The layers are absolutely positioned inside a `min-h-[100svh]` container. Put the CSS in `parallax-scrolling.css`, `will-change: transform` on the layers only.
- [ ] **Step 5:** Implement `hero-layers.tsx` as inline SVG components (`aria-hidden="true"`, `preserveAspectRatio="xMidYMid slice"`), colors only via `currentColor` / CSS vars:
  - `CodeLinesLayer`: rows of rounded bars of varying length in `dim_grey-300` at low opacity, like code seen from far away.
  - `DiffBlocksLayer`: three or four offset blocks of bars with a 3px left edge in `diff-add` or `diff-del`.
  - `CommentChipsLayer`: two or three small `surface-raised` pills with a severity dot and a short label ("possible null", "unsanitized input", "N+1 query"), each over a short `accent` wavy underline path. Keep them out of the headline's area at 1280×800.
- [ ] **Step 6:** Implement `hero.tsx`: wordmark-free title block (the header already has it), `h1` in `font-display` at a size that keeps the block, the sentence and both actions within 800px height at 1280 wide, `<SignInButton variant="primary" />` and `<CopyCommand command="npm i -g @revio/cli" />`.
- [ ] **Step 7:** Run `pnpm test`. Expected: PASS. Commit `feat(landing): parallax hero with Revio layers`.

### Task 5: Tool samples (CLI, VS Code, GitHub)

**Files:**
- Create: `src/modules/landing/sample-issues.ts`, `src/modules/landing/components/cli-sample.tsx`, `vscode-sample.tsx`, `github-sample.tsx`, `tools-section.tsx`
- Test: `src/modules/landing/components/cli-sample.test.tsx`

**Interfaces:**
- Produces: `SAMPLE_ISSUES: { file; line; severity: "error"|"warning"|"info"; category: "bug"|"security"|"performance"|"quality"|"style"; message; suggestion? }[]` (same shape as `@revio/types` `Issue`), shared by all three samples.
- Produces: `formatCliLine(issue): { head: string; suggestion?: string }`, which matches the real CLI formatter in `revio-backend/packages/cli/src/format.ts` without color: head = `` `${file}:${line}  ${ICON} ${severity}  [${category}] ${message}` `` with icons `error ✖`, `warning ⚠`, `info ℹ`; suggestion = `` `    → ${suggestion}` ``; issues sorted by file, then line.

- [ ] **Step 1: Write the failing tests:**
  - `formatCliLine({ file: "src/api/users.ts", line: 42, severity: "error", category: "security", message: "User input is passed to the SQL query unescaped.", suggestion: "Use a parameterized query." })` → head `"src/api/users.ts:42  ✖ error  [security] User input is passed to the SQL query unescaped."`, suggestion `"    → Use a parameterized query."`;
  - `<CliSample />` renders the prompt line `$ revio review`, then one line per sample issue in sorted order.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement. `SAMPLE_ISSUES` holds 3 issues across 2 files (one security error, one bug warning, one info). The CLI sample is a plain `surface` block, not a window frame. Colors match the CLI: error `danger`, warning `warning`, info `info`, suggestion `diff-add`, file:line bold.
- [ ] **Step 4:** VS Code sample: a few lines of code with a wavy `text-decoration` underline in the issue's severity color on the flagged line, and below it a small popover-style list item "Apply Revio fix" with the suggestion. GitHub sample:
  - an inline comment: severity + category, the message, and a ```suggestion block;
  - a summary comment titled "Revio review" with risk (`low`/`medium`/`high`), a one-paragraph summary and counts by severity computed from `SAMPLE_ISSUES`, not hard-coded.

  These are the format the Phase 3 backend must match. No avatars or fake usernames: label the author "revio".
- [ ] **Step 5:** `tools-section.tsx`: three rows (alternating sample left and right on ≥ md, stacked on mobile), each with an `h2` (Poppins), one sentence and a "When / Depth" line: CLI "on save, on demand, before commit · quick: bugs, security"; VS Code "after each commit · normal: + performance, quality"; GitHub "when a PR opens or updates · full: + style, summary, risk". Use at most one of the two allowed display-font headings here.
- [ ] **Step 6:** Run `pnpm test`. Expected: PASS. Commit `feat(landing): CLI, VS Code and GitHub samples`.

### Task 6: Assemble the page, header, install, footer, favicon

**Files:**
- Create: `src/modules/landing/components/site-header.tsx`, `install-section.tsx`, `site-footer.tsx`, `src/modules/landing/pages/landing-page.tsx`, `src/modules/landing/index.ts`
- Create: `src/app/icon.svg`, `src/components/wordmark.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/modules/landing/pages/landing-page.test.tsx`

**Interfaces:**
- Consumes: `SignInButton` (Task 2), `CopyCommand` (Task 3), `Hero` (Task 4), `ToolsSection` (Task 5).
- Produces: `LandingPage` from `@/modules/landing`. `src/app/page.tsx` is exactly:

  ```tsx
  import { LandingPage } from "@/modules/landing";
  export default LandingPage;
  ```

- [ ] **Step 1: Write the failing test:** `<LandingPage />` has one `h1`; exactly one `banner` and one `contentinfo` landmark; a "Sign in with GitHub" button in the header and one in the hero; the install section contains the CLI command, a VS Code item reading "Coming soon to the Marketplace" (no link until it's published), and a GitHub App item whose action is a `SignInButton`; no link points to `github.com/Teja3376` (repos are private).
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement:
  - `Wordmark`: "revio" in `font-display` `text-accent`, as a link to `/`.
  - `icon.svg`: a lowercase "r" as a path (not a font reference) in `#cf8c44` on `#0d060f`. This is the one allowed hex outside `globals.css`: add `src/app/icon.svg` to the Task 1 test's skip list.
  - Header: sticky, `bg-bg/80` with backdrop blur, wordmark left, text `SignInButton` right.
  - Footer: wordmark and "© 2026 Charan Teja".
- [ ] **Step 4:** Run `pnpm test && pnpm typecheck && pnpm lint && pnpm build`. Expected: all pass.
- [ ] **Step 5: Check in a browser** (Playwright MCP against `pnpm dev`):
  - at 1280×800 the headline, sentence and both hero actions are visible without scrolling;
  - at 360×800 there's no horizontal scroll (`document.documentElement.scrollWidth === 360`);
  - with `emulateMedia({ reducedMotion: "reduce" })`, scrolling doesn't move the layers;
  - with JS disabled, the hero text and actions render;
  - tabbing shows a focus ring on every button and link;
  - clicking "Sign in with GitHub" goes to Supabase (an error page about the GitHub provider is expected until it's configured).

  Save screenshots to the session scratchpad.
- [ ] **Step 6:** Commit `feat(landing): assemble landing page`.

### Task 7: Hallmark check (owner's request)

- [ ] **Step 1:** Invoke the `hallmark` skill, which the owner named, to audit the landing page against its rules and DESIGN.md's floor, using the Task 6 screenshots and the source.
- [ ] **Step 2:** Fix each finding that doesn't conflict with an owner decision (palette, fonts, hero copy, Osmo parallax). List any conflicts for the owner instead of changing them.
- [ ] **Step 3:** Re-run `pnpm test && pnpm typecheck && pnpm lint && pnpm build` and the Task 6 browser checks. Expected: all pass.
- [ ] **Step 4:** Commit `fix(landing): Hallmark review fixes`. Report to the owner what changed and what was left as their call.
