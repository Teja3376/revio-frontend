# revio-frontend

Revio's website (`revio.charanteja.site`): the public landing and docs pages, and the signed-in dashboard where you
turn reviews on per repository, pick the depth, and read past pull request reviews.

Next.js App Router · Tailwind · shadcn/ui · TanStack Query · Supabase Auth (GitHub). Look and feel: `../DESIGN.md`.

## Run it

```sh
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project (sign-in) |
| `NEXT_PUBLIC_API_URL` | The Revio API, e.g. `http://localhost:4000`. Leave empty in development to use built-in sample data. |
| `NEXT_PUBLIC_GITHUB_APP_INSTALL_URL` | `https://github.com/apps/<app-slug>/installations/new` |
| `SUPABASE_SECRET_KEY` | Server-only Supabase key |

Sign-in needs the GitHub provider on in Supabase (with the GitHub App's client ID and secret) and
`http://localhost:3000/**` in Supabase → Auth → Redirect URLs.

## Check it

```sh
pnpm test              # vitest, tests/ mirrors src/
npx tsc --noEmit
npx biome check src tests
```

## Layout

```
src/app/          routes: (site) public pages, (dashboard) signed-in pages, auth/callback, not-found, error
src/modules/      one folder per feature (landing, auth, dashboard, repos, reviews, settings, docs, …)
src/components/   shared components; components/ui is shadcn
src/lib/          API client, Supabase clients, sample data
tests/            tests, same paths as src/; tests/support has render and sample-API helpers
```
