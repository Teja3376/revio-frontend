import { Lightbulb } from "lucide-react";
import { SAMPLE_ISSUES } from "../sample-issues";

const CODE = [
  { n: 40, text: "export async function findUser(req: Request) {" },
  { n: 41, text: "  const id = req.query.id;" },
  // biome-ignore lint/suspicious/noTemplateCurlyInString: shows source code
  { n: 42, text: "  const rows = await db.query(`SELECT * FROM users WHERE id = ${id}`);" },
  { n: 43, text: "  return rows[0];" },
  { n: 44, text: "}" },
];

const flagged = SAMPLE_ISSUES[0];

export function VscodeSample() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface text-[13px] leading-6">
      <p className="border-b border-border px-5 py-2 text-xs text-text-muted">{flagged.file}</p>
      <div className="overflow-x-auto px-5 py-4 whitespace-pre">
        {CODE.map((row) => (
          <p key={row.n}>
            <span aria-hidden="true" className="mr-5 inline-block w-6 text-right text-dim_grey-600">
              {row.n}
            </span>
            <span
              className={
                row.n === flagged.line
                  ? "text-text underline decoration-danger decoration-wavy underline-offset-4"
                  : "text-text-muted"
              }
            >
              {row.text}
            </span>
          </p>
        ))}
      </div>
      <div className="mx-5 mb-5 rounded-lg border border-border bg-surface-raised p-4">
        <p className="text-text">
          <span className="text-danger">Revio, security:</span> {flagged.message}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-accent">
          <Lightbulb aria-hidden="true" className="size-4" />
          Apply Revio fix: {flagged.suggestion}
        </p>
      </div>
    </div>
  );
}
