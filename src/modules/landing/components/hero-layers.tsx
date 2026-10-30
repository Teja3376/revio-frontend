import type { CSSProperties } from "react";

// Revio's hand-made parallax art. Decorative only: every layer is aria-hidden.

type Strand = { d: string; tone: string; width: number; delay: string };

// Long loose wool strands drifting behind the headline, drawn in as it is written.
const FAR: Strand[] = [
  {
    d: "M-80 210C260 110 560 360 900 230S1310 100 1520 250",
    tone: "text-dim_grey-300",
    width: 2,
    delay: "0s",
  },
  {
    d: "M-80 720C240 640 540 830 880 690S1260 560 1520 730",
    tone: "text-dim_grey-300",
    width: 2,
    delay: "0.3s",
  },
];
const NEAR: Strand[] = [
  {
    d: "M-80 470C200 560 430 330 720 480S1160 630 1520 400",
    tone: "text-brown_bark-500",
    width: 3,
    delay: "0.5s",
  },
  {
    d: "M1520 140C1180 260 980 60 700 160S260 300 -80 120",
    tone: "text-coffee_bean-600",
    width: 2.5,
    delay: "0.9s",
  },
];

function Strands({ strands }: { strands: Strand[] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      fill="none"
      strokeLinecap="round"
    >
      {strands.map((s) => (
        <g key={s.d} className={s.tone}>
          <path
            d={s.d}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={s.width}
            strokeOpacity={0.55}
            className="hero-strand"
            style={{ "--delay": s.delay } as CSSProperties}
          />
        </g>
      ))}
    </svg>
  );
}

/** Far layer: two faint strands. */
export function FarStrandsLayer() {
  return <Strands strands={FAR} />;
}

/** Middle layer: two warmer strands closer to the headline. */
export function NearStrandsLayer() {
  return <Strands strands={NEAR} />;
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
      {CHIPS.map((c, i) => (
        <div
          key={c.label}
          className={`absolute flex flex-col items-start gap-1 ${c.position} hero-land`}
          style={{ "--delay": `${2.6 + i * 0.25}s` } as CSSProperties}
        >
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
