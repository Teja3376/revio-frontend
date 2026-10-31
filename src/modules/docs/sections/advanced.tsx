import { Code, CodeBlock, DocSection } from "../components/docs-ui";

const CI_YAML = `name: Revio
on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # the base branch must exist locally
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm i -g @revio/cli
      - run: revio review --base origin/\${{ github.base_ref }} --block-on error
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}`;

export function DailyUse() {
  return (
    <DocSection id="daily-use" title="Everyday workflow">
      <p>Use git every day? Here’s how Revio fits around save, commit and push.</p>
      <h3 className="font-medium text-text">While you code</h3>
      <p>
        Leave <Code>revio watch</Code> running in a second terminal. It reviews each file 2 seconds
        after you stop saving it, skips a file whose changes haven’t changed since the last check,
        and ignores <Code>node_modules</Code>, <Code>dist</Code>, <Code>build</Code>,{" "}
        <Code>.next</Code>, <Code>coverage</Code> and <Code>.git</Code>. Unlike{" "}
        <Code>revio review</Code>, it also checks new files you haven’t added to git yet.
      </p>
      <h3 className="font-medium text-text">Before you commit</h3>
      <p>
        Install the pre-commit hook once per repository (<Code>revio hook install</Code>), or run{" "}
        <Code>revio review --staged</Code> yourself to check exactly what you’re about to commit.
      </p>
      <h3 className="font-medium text-text">Before you open a pull request</h3>
      <p>
        <Code>revio review --base main</Code> reviews every commit on your branch since it split
        from main. It doesn’t include uncommitted changes, so commit first.
      </p>
      <h3 className="font-medium text-text">When you want more</h3>
      <p>
        Add <Code>--depth normal</Code> to also check performance and quality, or{" "}
        <Code>--depth full</Code> for style, a summary and a risk level. Deeper reviews take longer.
      </p>
    </DocSection>
  );
}

export function Ci() {
  return (
    <DocSection id="ci" title="Run Revio in CI">
      <p>
        Make Revio a required check so a pull request with an error-level issue can’t merge. Add
        your key as a repository secret named <Code>GEMINI_API_KEY</Code>, then add this workflow:
      </p>
      <CodeBlock label=".github/workflows/revio.yml">{CI_YAML}</CodeBlock>
      <p>
        The job fails (exit code 1) when an issue reaches <Code>--block-on</Code>. It also fails
        (exit code 2) when the review can’t run, for example when the secret is missing or Gemini is
        down. Use <Code>--block-on warning</Code> to be stricter.
      </p>
    </DocSection>
  );
}

export function TeamRules() {
  return (
    <DocSection id="team-rules" title="Share rules with your team">
      <p>
        Commit a <Code>.revio.json</Code> so everyone gets the same reviews. Put house rules in{" "}
        <Code>rules</Code>; Revio adds them to every review.
      </p>
      <CodeBlock label=".revio.json">{`{
  "ignore": ["**/*.generated.ts", "**/__snapshots__/**"],
  "rules": "All input is validated with zod. Never log tokens. Prefer async/await."
}`}</CodeBlock>
      <p>
        The GitHub App reads <Code>.revio.json</Code> from the pull request’s base branch, so a pull
        request can’t loosen its own rules.
      </p>
    </DocSection>
  );
}

export function BigRepos() {
  return (
    <DocSection id="big-repos" title="Big repositories and monorepos">
      <p>
        Revio finds the repository root itself, so you can run it from any folder inside the
        project. <Code>.revio.json</Code> lives at that root, and <Code>ignore</Code> patterns match
        paths from the root (<Code>packages/web/**</Code>).
      </p>
      <p>
        Large changes are split into batches of about 2,000 changed lines, reviewed one after
        another. Pin a model with <Code>model</Code> if you want reviews that don’t change when
        Google updates <Code>gemini-flash-latest</Code>.
      </p>
    </DocSection>
  );
}

export function HowItWorks() {
  return (
    <DocSection id="how-it-works" title="How a review works">
      <ol className="ml-5 flex list-decimal flex-col gap-2">
        <li>Revio asks git for the diff: only the parts of files you changed.</li>
        <li>
          It drops lockfiles, build output, minified files, binaries and your ignore patterns.
        </li>
        <li>
          It sends each changed file to Gemini with line numbers and the categories allowed at that
          depth.
        </li>
        <li>
          Gemini must answer in a fixed JSON shape. Revio checks it; a broken answer is retried once
          and never shown to you.
        </li>
        <li>
          Any issue that doesn’t point at a line you actually changed, or is outside the depth, is
          thrown away.
        </li>
      </ol>
    </DocSection>
  );
}
