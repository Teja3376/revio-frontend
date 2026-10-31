# Revio plan and audit (2026-10-31)

Living list of what's done and what to improve next, across `revio-backend` and `revio-frontend`.
Both repos: all work merged into `main`, nothing pushed.

## Done today

- GitHub App created (`revio-code-review`, App ID 5552700); credentials in `apps/api/.env`; Supabase GitHub provider on.
- Supabase migrations applied; GitHub sign-in works locally; dashboard uses the real API (`NEXT_PUBLIC_API_URL`).
- Dashboard redesigned: dense, Linear-style (see `DESIGN.md` → Dashboard). Account menu links to the GitHub profile.
- Frontend states: 404 page, crash pages (`error.tsx`, dashboard `error.tsx`, `global-error.tsx`), sign-in failure shows
  the real reason, filtered Reviews list explains an empty filter. Callback logs why a sign-in failed (`[auth] …`).
- Tests moved to `tests/` in every package; all pass (frontend 162, backend 208).
- `pnpm install` in the backend works (`allowBuilds` in `pnpm-workspace.yaml`).
- Fixed: 4 CLI watch tests failed whenever the whole backend suite ran (they slept a fixed 240 ms; now they wait for
  the result). Because turbo stopped at that failure, the 99 API tests weren't running in `pnpm test` at all.
- `DESIGN.md` completed (pages, states, colors, primary action, hero, logo). `CLAUDE.md`, API and frontend READMEs updated.

## Why the 404 / error states were missed

The Phase 3 plans listed loading, empty and error states inside each data view (they exist and are tested), but no
task covered route-level states: Next.js `not-found.tsx` / `error.tsx` / `global-error.tsx`. Sign-in errors were
also only tested through `?auth_error`; nobody knew Supabase sends the reason after `#`, which never reaches the
server, until a real sign-in failed. Lesson: every plan gets a "states" checklist per route (loading, empty, error,
not found, crash, signed out), and auth gets one real end-to-end try before it's called done.

## Audit: what to improve, most important first

### Blocking a real review
1. **Gemini returns 403 "free tier not available".** Enable billing on the Google project, then run
   `npx tsx packages/core/scripts/smoke.ts`. Until then no review can run anywhere (CLI, VS Code, GitHub).
2. **Webhooks can't reach the local API.** Run a smee client to `http://localhost:4000/webhooks/github`, install the
   app on a test repo, open a PR, and watch one full review (queue → Gemini → comments). Never done yet.

### Security
3. **Rotate the secrets pasted in chat today:** GitHub App client secret(s), the first private key (delete it on
   GitHub), and the Supabase database password. Then delete the `.pem` files in `~/Downloads`.
4. Add the frontend's own Content-Security-Policy and security headers in `next.config.ts` before deploy.

### Product gaps
5. Show the user's display name (store `name` from GitHub in `users`, or read Supabase `user_metadata.full_name`).
6. Settings: list GitHub installations (personal / orgs) with "Manage on GitHub" links.
7. Dashboard shows nothing about the daily cap (50 reviews per installation): show "N of 50 used today".
8. Review detail could link each issue to the exact line on GitHub (`prUrl` + `/files#diff-…`), and show the commit SHA.
9. Keyboard shortcuts in the dashboard (j/k, Enter, `/` to filter) to finish the Linear feel.

### Engineering
10. **No CI for the frontend** (`revio-backend` has `.github/workflows/ci.yml`; `revio-frontend` has none). Add one
    running tests, typecheck and lint.
11. The full backend suite takes ~1 min with PGlite; fine now, watch it.
12. The dashboard redesign hasn't been looked at signed in, in a real browser. Do that and adjust spacing.
13. Older plans in `revio-backend/docs/superpowers/plans/` still show tests next to source files; they are history,
    so leave them, but new plans use `tests/`.

### Shipping (Phase 4)
14. Deploy: Cloudflare for the site, API on Cloudflare Containers or Railway/Fly.io, set real URLs in the GitHub App
    (webhook, callback, setup URL) and Supabase redirect URLs, then push both repos.
15. Publish the CLI to npm and the VS Code extension (owner's call).

## Rules to keep

TDD, no network in tests, tests in `tests/`, smallest change, follow `DESIGN.md`. Don't push or change
GitHub/Supabase settings without the owner.
