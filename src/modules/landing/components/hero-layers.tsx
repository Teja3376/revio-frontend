// Revio's hand-made parallax art. Decorative only: every layer is aria-hidden.

// Fixed pseudo-random sequence so server and client render the same SVG.
function sequence(seed: number, length: number) {
  let s = seed;
  return Array.from({ length }, () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  });
}

const ROW_COUNT = 30;
const codeRows = sequence(7, ROW_COUNT * 2).reduce<{ x: number; y: number; w: number }[]>(
  (rows, r, i) => {
    const column = i % 2;
    const row = Math.floor(i / 2);
    const indent = Math.floor(r * 4) * 32;
    rows.push({ x: 80 + column * 760 + indent, y: 36 + row * 30, w: 120 + Math.round(r * 380) });
    return rows;
  },
  [],
);

/** Far layer: rows of code seen from a distance. */
export function CodeLinesLayer() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="size-full fill-dim_grey-300 opacity-40"
    >
      {codeRows.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={8} rx={4} />
      ))}
    </svg>
  );
}

type Block = { x: number; y: number; w: number; rows: number; kind: "add" | "del" };

const BLOCKS: Block[] = [
  { x: 120, y: 130, w: 300, rows: 3, kind: "del" },
  { x: 1040, y: 110, w: 330, rows: 4, kind: "add" },
  { x: 60, y: 560, w: 360, rows: 5, kind: "add" },
  { x: 1000, y: 610, w: 380, rows: 4, kind: "del" },
];

/** Middle layer: diff hunks with added and removed edges. */
export function DiffBlocksLayer() {
  const widths = sequence(11, 32);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
    >
      {BLOCKS.map((b, bi) => {
        const height = 24 + b.rows * 26;
        const edge = b.kind === "add" ? "fill-diff-add" : "fill-diff-del";
        return (
          <g key={`${b.x}-${b.y}`}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={height}
              rx={10}
              className="fill-surface stroke-border opacity-80"
            />
            <rect x={b.x} y={b.y + 10} width={3} height={height - 20} rx={1.5} className={edge} />
            {Array.from({ length: b.rows }, (_, ri) => ({ y: b.y + 20 + ri * 26, ri })).map(
              ({ y, ri }) => (
                <g key={y}>
                  <rect x={b.x + 20} y={y} width={8} height={8} rx={2} className={edge} />
                  <rect
                    x={b.x + 38}
                    y={y}
                    width={(b.w - 70) * (0.45 + widths[bi * 8 + ri] * 0.55)}
                    height={8}
                    rx={4}
                    className="fill-dim_grey-400"
                  />
                </g>
              ),
            )}
          </g>
        );
      })}
    </svg>
  );
}

type Chip = { label: string; tone: string; position: string };

const CHIPS: Chip[] = [
  { label: "possible null", tone: "text-warning", position: "left-[7%] top-[24%]" },
  { label: "unsanitized input", tone: "text-rich_mahogany-900", position: "right-[8%] top-[64%]" },
  { label: "N+1 query", tone: "text-info", position: "left-[12%] top-[76%]" },
];

/** Near layer: review comments with Revio's amber underline. */
export function CommentChipsLayer() {
  return (
    <div aria-hidden="true" className="relative size-full">
      {CHIPS.map((c) => (
        <div key={c.label} className={`absolute flex flex-col items-start gap-1 ${c.position}`}>
          <span
            className={`rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs ${c.tone}`}
          >
            {c.label}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 120 8"
            className="ml-3 h-2 w-28 fill-none stroke-accent"
          >
            <path d="M0 4 Q 5 0 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4 T 70 4 T 80 4 T 90 4 T 100 4 T 110 4 T 120 4" />
          </svg>
        </div>
      ))}
    </div>
  );
}
