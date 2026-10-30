import { CliSample } from "./cli-sample";
import { GithubSample } from "./github-sample";
import { VscodeSample } from "./vscode-sample";

const TOOLS = [
  {
    title: "In your terminal",
    body: "Checks your changes as you save, and stays quiet unless something matters.",
    when: "On save, on demand, before commit",
    depth: "Quick: bugs, security",
    Sample: CliSample,
  },
  {
    title: "In your editor",
    body: "Underlines problems after each commit, with a one-click fix.",
    when: "After each commit",
    depth: "Normal: adds performance, quality",
    Sample: VscodeSample,
  },
  {
    title: "On your pull requests",
    body: "Inline comments on the lines that need them, plus one summary with a risk level.",
    when: "When a PR opens or updates",
    depth: "Full: adds style, summary, risk",
    Sample: GithubSample,
  },
];

export function ToolsSection() {
  return (
    <section aria-labelledby="tools-heading" className="mx-auto max-w-[1120px] px-6 py-32">
      <h2 id="tools-heading" className="font-display text-4xl text-text md:text-5xl">
        One reviewer, three places.
      </h2>
      <div className="mt-16 flex flex-col gap-24">
        {TOOLS.map(({ title, body, when, depth, Sample }, i) => (
          <div
            key={title}
            className={`grid grid-cols-[minmax(0,1fr)] items-center gap-8 md:gap-14 ${
              i % 2 === 1
                ? "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
                : "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            }`}
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <h3 className="text-2xl font-semibold text-text">{title}</h3>
              <p className="mt-3 text-text-muted">{body}</p>
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-text-muted">When</dt>
                <dd className="text-text">{when}</dd>
                <dt className="text-text-muted">Depth</dt>
                <dd className="text-text">{depth}</dd>
              </dl>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : undefined}>
              <Sample />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
