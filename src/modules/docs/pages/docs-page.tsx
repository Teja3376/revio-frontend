import { PageTransition } from "@/components/page-transition";
import { Code, CodeBlock, Command, DocSection, DocTable } from "../components/docs-ui";

// Everything here is written from the real code in revio-backend (CLI, core, VS Code
// package.json) and the design spec. Update it when those change.

const NAV = [
  { group: "Start", items: [{ id: "overview", label: "Overview" }] },
  {
    group: "Install",
    items: [
      { id: "install-cli", label: "CLI" },
      { id: "install-vscode", label: "VS Code" },
      { id: "install-github", label: "GitHub App" },
    ],
  },
  {
    group: "Set up",
    items: [
      { id: "setup-key", label: "Gemini API key" },
      { id: "setup-config", label: ".revio.json" },
      { id: "setup-hook", label: "Pre-commit hook" },
    ],
  },
  {
    group: "Use",
    items: [
      { id: "use-cli", label: "CLI commands" },
      { id: "use-vscode", label: "In VS Code" },
      { id: "use-github", label: "On pull requests" },
    ],
  },
  {
    group: "Reference",
    items: [
      { id: "config-reference", label: "Configuration" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

export function DocsPage() {
  return (
    <PageTransition>
      <div className="mx-auto grid max-w-page gap-12 px-6 py-16 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="Docs sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-col gap-6 text-sm">
            {NAV.map((g) => (
              <li key={g.group}>
                <p className="font-medium text-text">{g.group}</p>
                <ul className="mt-2 flex flex-col gap-1.5 border-l border-border">
                  {g.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-text-muted hover:border-accent hover:text-text"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <article className="flex min-w-0 flex-col gap-20">
          <header>
            <h1 className="font-display text-5xl text-text md:text-6xl">Revio docs</h1>
            <p className="mt-4 max-w-[60ch] text-lg text-text-muted">
              Install Revio, connect it, and get reviews where you already work.
            </p>
          </header>

          <DocSection id="overview" title="Overview">
            <p>
              Revio is an AI code reviewer. It reads the lines you changed, sends them to Google
              Gemini, and shows only issues tied to real changed lines. One review engine runs in
              three places, each at its own depth.
            </p>
            <DocTable
              label="Where Revio runs"
              head={["Tool", "When it runs", "Depth", "What it checks"]}
              rows={[
                ["CLI", "On save, on demand, before commit", "quick", "Bugs, security"],
                ["VS Code", "After each commit", "normal", "Adds performance, quality"],
                [
                  "GitHub App",
                  "When a PR opens or updates",
                  "full",
                  "Adds style, a summary and a risk level",
                ],
              ]}
            />
            <p>
              Revio skips lockfiles, <Code>dist/</Code>, <Code>build/</Code>, minified files, source
              maps, binary files and deleted files, plus anything you list in{" "}
              <Code>.revio.json</Code>. Gitignored files such as <Code>.env</Code> are never sent.
            </p>
          </DocSection>

          <div className="flex flex-col gap-14">
            <DocSection id="install-cli" title="Install the CLI" status="Publishing to npm soon">
              <p>Needs Node 22.12 or newer and git.</p>
              <Command>npm i -g @revio/cli</Command>
              <p>
                Check it worked with <Code>revio --version</Code>. Then set your{" "}
                <a href="#setup-key" className="text-accent underline underline-offset-4">
                  Gemini API key
                </a>
                .
              </p>
            </DocSection>

            <DocSection
              id="install-vscode"
              title="Install the VS Code extension"
              status="In progress"
            >
              <p>
                The extension is being built and is not on the Marketplace yet. When it ships you
                will install <Code>Revio: AI Code Review</Code> from the Extensions view, then run{" "}
                <Code>Revio: Set Gemini API Key</Code> from the Command Palette.
              </p>
            </DocSection>

            <DocSection id="install-github" title="Install the GitHub App" status="Coming soon">
              <p>
                Sign in on this site with GitHub, then install the Revio app on the repositories you
                choose. Reviews run on Revio’s own Gemini key, so you don’t need one. Each
                installation gets up to 50 reviews a day.
              </p>
            </DocSection>
          </div>

          <div className="flex flex-col gap-14">
            <DocSection id="setup-key" title="Set your Gemini API key">
              <p>
                The CLI and the VS Code extension call Gemini with your own key. Create one in{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  className="text-accent underline underline-offset-4"
                >
                  Google AI Studio
                </a>
                , then add it to your shell profile (<Code>~/.zshrc</Code> or <Code>~/.bashrc</Code>
                ):
              </p>
              <CodeBlock label="~/.zshrc">{'export GEMINI_API_KEY="your-key"'}</CodeBlock>
              <p>
                Open a new terminal afterwards. The VS Code extension will keep its key in the
                editor’s secret storage, never in your settings file.
              </p>
              <p>
                If Gemini answers <Code>403 free tier not available</Code>, turn on billing for the
                Google project that owns the key.
              </p>
            </DocSection>

            <DocSection id="setup-config" title="Add a .revio.json (optional)">
              <p>
                Put a <Code>.revio.json</Code> at the root of your repository to change depths, skip
                files or give Revio your team’s rules. Every key is optional; unknown keys are
                rejected with the name of the bad field.
              </p>
              <CodeBlock label=".revio.json">{`{
    "depth": { "cli": "quick", "vscode": "normal", "github": "full" },
    "ignore": ["**/*.snap", "docs/**"],
    "rules": "We use zod for all input validation."
  }`}</CodeBlock>
            </DocSection>

            <DocSection id="setup-hook" title="Review before every commit">
              <p>
                The hook runs <Code>revio review --staged</Code> before each commit. By default it
                only warns and never blocks the commit:
              </p>
              <Command>revio hook install</Command>
              <p>To stop commits that have an error-level issue:</p>
              <Command>revio hook install --block-on error</Command>
              <p>
                With <Code>--block-on</Code>, the commit also stops when the review can’t run: no
                Gemini key, a bad <Code>.revio.json</Code>, or Gemini being down or refusing the
                key. Use <Code>git commit --no-verify</Code> to skip the hook once.
              </p>
              <p>
                It works with plain git hooks, a custom <Code>core.hooksPath</Code> and husky v9,
                and keeps the commands already in your hook. Remove it with:
              </p>
              <Command>revio hook uninstall</Command>
            </DocSection>
          </div>

          <div className="flex flex-col gap-14">
            <DocSection id="use-cli" title="Use the CLI">
              <p>Run these inside a git repository.</p>
              <DocTable
                label="CLI commands"
                head={["Command", "What it does"]}
                rows={[
                  [
                    <Code key="c">revio review</Code>,
                    <span key="d">
                      Reviews changes to tracked files since your last commit. New files need{" "}
                      <Code>git add</Code> first.
                    </span>,
                  ],
                  [<Code key="c">revio review --staged</Code>, "Reviews only what you’ve staged."],
                  [
                    <Code key="c">revio review --base main</Code>,
                    "Reviews every commit since main.",
                  ],
                  [
                    <Code key="c">revio review --depth normal</Code>,
                    "Goes deeper than your default (quick, or depth.cli in .revio.json).",
                  ],
                  [
                    <Code key="c">revio watch</Code>,
                    "Quietly reviews each file when you save it. Ctrl+C stops it.",
                  ],
                  [
                    <Code key="c">revio hook install</Code>,
                    "Adds the pre-commit check (see above).",
                  ],
                ]}
              />
              <p>
                Add <Code>--block-on error</Code> (or <Code>warning</Code>, <Code>info</Code>) to{" "}
                <Code>revio review</Code> to fail CI when an issue is at least that severe.
              </p>
              <DocTable
                label="Exit codes"
                head={["Exit code", "Meaning"]}
                rows={[
                  ["0", "Review finished (or nothing to review)."],
                  ["1", "An issue reached the --block-on severity."],
                  [
                    "2",
                    "Something stopped the review: a bad flag, not a git repo, bad config, a missing key or a Gemini error.",
                  ],
                ]}
              />
            </DocSection>

            <DocSection id="use-vscode" title="Use it in VS Code" status="In progress">
              <p>
                Once installed, Revio reviews each new commit in the background. Issues appear as
                underlines and in the Problems panel; where Revio has a fix, the quick fix menu
                offers <Code>Apply Revio fix</Code>.
              </p>
              <DocTable
                label="VS Code commands and settings"
                head={["Name", "What it does"]}
                rows={[
                  [
                    <Code key="c">Revio: Review Last Commit</Code>,
                    "Reviews the latest commit now.",
                  ],
                  [<Code key="c">Revio: Clear Issues</Code>, "Removes Revio’s underlines."],
                  [
                    <Code key="c">revio.enabled</Code>,
                    "Review each new commit automatically. Default on.",
                  ],
                  [<Code key="c">revio.depth</Code>, "quick, normal or full. Default normal."],
                ]}
              />
            </DocSection>

            <DocSection id="use-github" title="Use it on pull requests" status="Coming soon">
              <p>
                When a pull request opens or gets new commits, Revio posts comments on the lines
                that need them and one summary comment with a risk level (low, medium or high). It
                never reviews the same commit twice.
              </p>
              <p>
                Per repository, the dashboard lets you turn reviews on or off, pick the depth and
                add ignore patterns. Revio reads <Code>.revio.json</Code> from the pull request’s
                base branch, so a pull request can’t change its own review rules. Where both set the
                same thing, the dashboard wins.
              </p>
            </DocSection>
          </div>

          <div className="flex flex-col gap-14">
            <DocSection id="config-reference" title="Configuration reference">
              <DocTable
                label=".revio.json keys"
                head={["Key", "Type", "What it does"]}
                rows={[
                  [
                    <Code key="k">depth</Code>,
                    "{ cli, vscode, github }",
                    "Depth per tool: quick, normal or full. Defaults: quick, normal, full.",
                  ],
                  [<Code key="k">ignore</Code>, "string[]", "Glob patterns of files to skip."],
                  [
                    <Code key="k">model</Code>,
                    "string",
                    "Gemini model to use. Defaults: gemini-flash-latest (quick, normal), gemini-pro-latest (full).",
                  ],
                  [
                    <Code key="k">rules</Code>,
                    "string",
                    "Your team’s rules, added to every review.",
                  ],
                ]}
              />
            </DocSection>

            <DocSection id="faq" title="FAQ">
              <h3 className="font-medium text-text">Does Revio keep my code?</h3>
              <p>
                No. The CLI and the extension send the changed parts of your files straight to
                Gemini with your key. The GitHub App stores review results, never your code or
                diffs.
              </p>
              <h3 className="font-medium text-text">Why did Revio report nothing?</h3>
              <p>
                Either nothing was wrong, or the issue was outside the depth you asked for. Quick
                only looks at bugs and security; try <Code>--depth normal</Code>.
              </p>
              <h3 className="font-medium text-text">What happens with a very large change?</h3>
              <p>
                Revio splits it into batches of about 2,000 changed lines and reviews them one after
                another, so big diffs take longer.
              </p>
              <h3 className="font-medium text-text">
                The AI returned something odd. Will I see it?
              </h3>
              <p>
                No. Every answer is checked; if it can’t be read after one retry, Revio tells you to
                try again instead of showing it.
              </p>
            </DocSection>
          </div>
        </article>
      </div>
    </PageTransition>
  );
}
