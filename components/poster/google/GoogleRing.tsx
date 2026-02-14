/**
 * Circular ring with 4 Google-colored arc segments.
 * Pure SVG — server-renderable, no client JS.
 */

const COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"]; // blue, red, yellow, green
const RADIUS = 90;
const STROKE = 6;
const SIZE = (RADIUS + STROKE) * 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE / 4;
const GAP = 6; // gap between segments in px along the arc

export default function GoogleRing() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto"
      aria-hidden="true"
    >
      {COLORS.map((color, i) => {
        const offset = i * ARC_LENGTH;
        return (
          <circle
            key={color}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LENGTH - GAP} ${CIRCUMFERENCE - ARC_LENGTH + GAP}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        );
      })}
    </svg>
  );
}
