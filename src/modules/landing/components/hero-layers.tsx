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



