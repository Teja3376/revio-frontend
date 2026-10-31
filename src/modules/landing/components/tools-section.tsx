import { CliSample } from "./cli-sample";
import { GithubSample } from "./github-sample";
import { VscodeSample } from "./vscode-sample";

const STEPS = [
  {
    title: "You save: Revio checks it in your terminal",
    body: "Run revio review, or leave revio watch running. It stays quiet unless something matters.",
    depth: "Quick: bugs and security",
    caption:
      "Revio read the lines you changed in users.ts and dates.ts. It found an SQL injection on line 42 and a crash on line 43, and printed the fix under each.",
    Sample: CliSample,
  },
  {
    title: "You commit: Revio marks it in your editor",
    body: "The VS Code extension reviews each commit in the background and underlines what it finds.",
    depth: "Normal: adds performance and quality",
    caption:
      "The same SQL injection, underlined on line 42. Hover it for the reason, then pick “Apply Revio fix” to rewrite the line.",
    Sample: VscodeSample,
  },
  {
    title: "You open a pull request: Revio comments on GitHub",
    body: "The GitHub App reviews every push to the pull request, so your reviewer starts with the problems already found.",
    depth: "Full: adds style, a summary and a risk level",
    caption:
      "A comment on the exact line with a suggested change you can commit, plus one summary that rates the pull request’s risk.",
    Sample: GithubSample,
  },
];

export function ToolsSection() {
  return (
    <section aria-labelledby="tools-heading" className="mx-auto max-w-page px-6 py-32">
      <h2 id="tools-heading" className="font-display text-4xl text-text md:text-5xl">
        One reviewer, three places.
      </h2>
      <p className="mt-5 max-w-[60ch] text-lg text-text-muted">
        Revio checks the same change at three moments, a little deeper each time. Here is what it
        caught in one small change.
      </p>
      <ol aria-label="How Revio reviews a change" className="mt-16 flex flex-col gap-24">
        {STEPS.map(({ title, body, depth, caption, Sample }, i) => (
          <li
            key={title}
            className={`grid grid-cols-[minmax(0,1fr)] items-center gap-8 md:gap-14 ${
              i % 2 === 1
                ? "md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
                : "md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
            }`}
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <p className="text-sm text-accent">Step {i + 1} of 3</p>
              <h3 className="mt-2 text-2xl font-semibold text-text">{title}</h3>
              <p className="mt-3 text-text-muted">{body}</p>
              <p className="mt-4 text-sm text-text">{depth}</p>
            </div>
            <figure className={`flex flex-col gap-3 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              <Sample />
              <figcaption className="text-sm leading-6 text-text-muted">{caption}</figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
