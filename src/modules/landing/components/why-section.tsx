// Only claims that are true of Revio's code and design today. No other product is named.
const POINTS = [
  {
    title: "It doesn’t wait for the pull request",
    body: "Revio reviews in your terminal when you save and in your editor when you commit, so most problems are fixed before anyone else sees them.",
  },
  {
    title: "Quiet while you work",
    body: "On save it only flags bugs and security holes. Style comments wait for the pull request, and nothing pops up or blocks your editor.",
  },
  {
    title: "Every comment points at your change",
    body: "An issue must sit on a line you actually changed. AI answers that don’t fit Revio’s format are checked, retried once, and thrown away, never posted.",
  },
  {
    title: "Your code isn’t kept",
    body: "The CLI and editor send your changes straight to Gemini with your own key. The GitHub App stores review results, never your code or diffs.",
  },
  {
    title: "One rulebook everywhere",
    body: "The same .revio.json rules apply in the terminal, the editor and on GitHub. Pull requests read them from the base branch, so a PR can’t loosen its own review.",
  },
  {
    title: "No subscription",
    body: "The GitHub App runs on Revio’s own key, up to 50 reviews a day per installation. The CLI and editor use your Gemini key.",
  },
];

export function WhySection() {
  return (
    <section aria-labelledby="why-heading" className="border-t border-border">
      <div className="mx-auto grid max-w-page gap-12 px-6 py-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <div>
          <h2 id="why-heading" className="font-display text-4xl text-text md:text-5xl">
            Why Revio
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg text-text-muted">
            Built by a developer who wanted reviews early, quiet and trustworthy.
          </p>
        </div>
        <ul className="grid gap-x-12 sm:grid-cols-2">
          {POINTS.map((p) => (
            <li key={p.title} className="border-t border-border py-6">
              <h3 className="font-semibold text-text">{p.title}</h3>
              <p className="mt-2 leading-7 text-text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
