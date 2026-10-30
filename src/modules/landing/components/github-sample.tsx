import { SAMPLE_ISSUES } from "../sample-issues";

// Defines the comment format the Phase 3 GitHub App must post (see the frontend spec).
const inline = SAMPLE_ISSUES[0];

const counts = (["error", "warning", "info"] as const)
  .map((s) => ({ s, n: SAMPLE_ISSUES.filter((i) => i.severity === s).length }))
  .filter((c) => c.n > 0)
  .map((c) => `${c.n} ${c.s}${c.n > 1 ? "s" : ""}`)
  .join(" · ");

function Comment({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <p className="border-b border-border px-5 py-2.5 text-xs text-text-muted">
        <span className="font-semibold text-text">revio</span> {title}
      </p>
      <div className="px-5 py-4 text-sm leading-6">{children}</div>
    </div>
  );
}

export function GithubSample() {
  return (
    <div className="flex flex-col gap-4">
      <Comment title={`commented on ${inline.file} line ${inline.line}`}>
        <p>
          <span className="text-danger">
            {inline.severity} · {inline.category}
          </span>{" "}
          {inline.message}
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border text-[13px] whitespace-pre">
          <p className="border-b border-border px-3 py-1.5 text-xs text-text-muted">
            Suggested change
          </p>
          <p className="bg-diff-del/25 px-3 py-1">
            {/* biome-ignore lint/suspicious/noTemplateCurlyInString: shows source code */}
            {"- const rows = await db.query(`SELECT * FROM users WHERE id = ${id}`);"}
          </p>
          <p className="bg-diff-add/20 px-3 py-1">
            {'+ const rows = await db.query("SELECT * FROM users WHERE id = $1", [id]);'}
          </p>
        </div>
      </Comment>
      <Comment title="Revio review">
        <p>
          <span className="text-text-muted">Risk:</span>{" "}
          <span className="font-semibold text-danger">high</span>
          <span className="text-text-muted"> · {counts}</span>
        </p>
        <p className="mt-2 text-text-muted">
          Adds a user lookup endpoint. The query is built from request input, and a missing user
          crashes the handler.
        </p>
      </Comment>
    </div>
  );
}
