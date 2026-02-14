/**
 * Row of 5 yellow stars for the Google-style poster.
 */

const STAR_COLOR = "#FBBC05";

function Star() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill={STAR_COLOR}
      />
    </svg>
  );
}

export default function Stars() {
  return (
    <div className="flex items-center justify-center gap-1" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} />
      ))}
    </div>
  );
}
