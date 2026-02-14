import GoogleRing from "./GoogleRing";
import Stars from "./Stars";
import QrCode from "@/components/QrCode";

interface GooglePosterProps {
  qrUrl: string;
}

/**
 * "Review us on Google" poster layout.
 * Designed for screen display and print (print styles strip background/shadow).
 */

const GOOGLE_LETTERS: { letter: string; color: string }[] = [
  { letter: "G", color: "#4285F4" },
  { letter: "o", color: "#EA4335" },
  { letter: "o", color: "#FBBC05" },
  { letter: "g", color: "#4285F4" },
  { letter: "l", color: "#34A853" },
  { letter: "e", color: "#EA4335" },
];

export default function GooglePoster({ qrUrl }: GooglePosterProps) {
  return (
    <div className="poster-card bg-white rounded-2xl shadow-lg max-w-md mx-auto px-8 py-10 text-center">
      {/* Google-colored ring with text inside */}
      <div className="relative mb-6">
        <GoogleRing />

        {/* Overlay text centered inside the ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[#5f6368] text-lg leading-tight">
            Review us
          </span>
          <span className="text-[#5f6368] text-lg leading-tight">on</span>
          <span className="text-[28px] font-medium leading-tight tracking-tight">
            {GOOGLE_LETTERS.map((gl, i) => (
              <span key={i} style={{ color: gl.color }}>
                {gl.letter}
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-6">
        <Stars />
      </div>

      {/* Instruction text */}
      <p className="text-[#202124] text-base mb-1 font-semibold">
        Scan the QR Code below
      </p>
      <p className="text-[#5f6368] text-base mb-6">to leave us a review!</p>

      {/* QR Code */}
      <div className="mb-6">
        <QrCode url={qrUrl} size={240} />
      </div>

      {/* Footer */}
      <p className="text-xs text-[#9aa0a6]">Powered by Peach Reviews</p>
    </div>
  );
}
