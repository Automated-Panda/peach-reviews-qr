"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { buildMapsWebUrl } from "@/lib/maps";

interface ReviewPageClientProps {
  token: string;
  businessName: string;
  reviewContent: string;
  listingUrl: string;
  googlePlaceId?: string;
}

export default function ReviewPageClient({
  token,
  businessName,
  reviewContent,
  listingUrl,
  googlePlaceId,
}: ReviewPageClientProps) {
  const [toastVisible, setToastVisible] = useState(false);

  // Log scan on page load
  useEffect(() => {
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {
      // Scan logging is best-effort; don't break the page
    });
  }, [token]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reviewContent);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = reviewContent;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setToastVisible(true);
  }, [reviewContent]);

  const reviewUrl = buildMapsWebUrl({ googlePlaceId, listingUrl });

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[520px]">
        {/* Business name */}
        <h1 className="text-center text-[22px] sm:text-[26px] font-medium text-[#202124] mb-5">
          {businessName}
        </h1>

        {/* Review content */}
        <Card className="mb-5">
          <p className="text-[#3c4043] text-[15px] leading-relaxed whitespace-pre-line">
            {reviewContent}
          </p>
        </Card>

        {/* Copy button */}
        <Button variant="primary" onClick={handleCopy} className="mb-3">
          Copy Review
        </Button>

        {/* Helper text */}
        <p className="text-center text-sm text-[#9aa0a6] mb-3">
          Then tap below to paste it
        </p>

        {/* CTA button – plain <a> tag via href to avoid Google bot detection */}
        <Button variant="outline" href={reviewUrl}>
          Paste Review on Google &rarr;
        </Button>
      </div>

      <Toast
        message="Copied!"
        visible={toastVisible}
        onDone={() => setToastVisible(false)}
      />
    </main>
  );
}
