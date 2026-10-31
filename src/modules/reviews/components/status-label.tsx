import type { ReviewStatus } from "../schemas";

const LABEL: Record<ReviewStatus, { text: string; tone: string }> = {
  queued: { text: "Queued", tone: "text-info" },
  running: { text: "Running", tone: "text-info" },
  done: { text: "Done", tone: "text-text" },
  failed: { text: "Failed", tone: "text-danger" },
  skipped: { text: "Skipped", tone: "text-text-muted" },
};

export function StatusLabel({ status }: { status: ReviewStatus }) {
  const { text, tone } = LABEL[status];
  return <span className={`text-[13px] font-medium ${tone}`}>{text}</span>;
}
