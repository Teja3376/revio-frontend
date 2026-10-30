import type { SampleIssue } from "../sample-issues";
import { SAMPLE_ISSUES } from "../sample-issues";

// Mirrors revio-backend/packages/cli/src/format.ts (formatIssues) without color codes.
const ICON = { error: "✖", warning: "⚠", info: "ℹ" } as const;
const TONE = { error: "text-danger", warning: "text-warning", info: "text-info" } as const;

export function formatCliLine(issue: SampleIssue): { head: string; suggestion?: string } {
  const head = `${issue.file}:${issue.line}  ${ICON[issue.severity]} ${issue.severity}  [${issue.category}] ${issue.message}`;
  return issue.suggestion ? { head, suggestion: `    → ${issue.suggestion}` } : { head };
}

export function CliSample() {
  const issues = [...SAMPLE_ISSUES].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface p-5 text-[13px] leading-6">
      <p className="text-text-muted">
        <span aria-hidden="true">$ </span>
        <span className="text-text">revio review</span>
      </p>
      <div className="mt-2 whitespace-pre">
        {issues.map((i) => (
          <div key={`${i.file}:${i.line}`}>
            <p data-testid="cli-head">
              <span className="font-semibold text-text">{`${i.file}:${i.line}`}</span>
              {"  "}
              <span className={TONE[i.severity]}>{`${ICON[i.severity]} ${i.severity}`}</span>
              {"  "}
              <span className="text-text-muted">{`[${i.category}]`}</span>
              {` ${i.message}`}
            </p>
            {i.suggestion ? <p className="text-diff-add">{formatCliLine(i).suggestion}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
