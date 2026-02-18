"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Card from "@/components/ui/Card";
import {
  buildMapsWebUrl,
  buildGoogleMapsAppUrl,
  buildGoogleAppUrl,
  buildChromeUrl,
} from "@/lib/maps";

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
  const [copied, setCopied] = useState(false);

  // Log scan on page load
  useEffect(() => {
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  }, [token]);

  // Async copy for the manual copy icon
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reviewContent);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = reviewContent;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
  }, [reviewContent]);

  // Copy via pointerdown so it fires before click/navigation
  const handlePointerDown = useCallback(() => {
    navigator.clipboard.writeText(reviewContent).catch(() => {});
    setCopied(true);
  }, [reviewContent]);

  const platform = useMemo(
    () => (/Android/i.test(navigator.userAgent) ? "android" as const : "ios" as const),
    [],
  );

  const reviewUrl = buildMapsWebUrl({ googlePlaceId, listingUrl });
  const mapsAppUrl = buildGoogleMapsAppUrl({ googlePlaceId, businessName, webUrl: reviewUrl, platform });
  const googleAppUrl = buildGoogleAppUrl(reviewUrl, platform);
  const chromeUrl = buildChromeUrl(reviewUrl, platform);

  return (
    <main className="min-h-screen flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[520px]">
        {/* Business name */}
        <h1 className="text-center text-[22px] sm:text-[26px] font-medium text-[#202124] mb-5">
          {businessName}
        </h1>

        {/* Review content with inline copy icon */}
        <Card className="mb-5 relative">
          <p className="text-[#3c4043] text-[15px] leading-relaxed whitespace-pre-line pr-8">
            {reviewContent}
          </p>
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Copy review"
          >
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </Card>

        {/* Helper text */}
        <p className="text-center text-sm text-[#9aa0a6] mb-3">
          Tap a button to copy &amp; paste your review
        </p>

        {/* Deep-link buttons – auto-copy on click, app-specific schemes bypass Safari */}
        <a
          href={mapsAppUrl}
          onPointerDown={handlePointerDown}
          className="w-full h-[52px] rounded-lg font-medium text-base text-[#3c4043] bg-white border border-[#dadce0] hover:bg-gray-50 relative inline-flex items-center justify-center no-underline transition-colors mb-2"
        >
          <span className="absolute left-3 w-8 h-8 inline-flex items-center justify-center">
            <img src="/icons/google-maps.svg" alt="" width={14} height={14} />
          </span>
          Open in Google Maps
        </a>
        <a
          href={googleAppUrl}
          onPointerDown={handlePointerDown}
          className="w-full h-[52px] rounded-lg font-medium text-base text-[#3c4043] bg-white border border-[#dadce0] hover:bg-gray-50 relative inline-flex items-center justify-center no-underline transition-colors mb-2"
        >
          <span className="absolute left-3 w-8 h-8 inline-flex items-center justify-center">
            <img src="/icons/google.svg" alt="" width={18} height={18} />
          </span>
          Open in Google App
        </a>
        <a
          href={chromeUrl}
          onPointerDown={handlePointerDown}
          className="w-full h-[52px] rounded-lg font-medium text-base text-[#3c4043] bg-white border border-[#dadce0] hover:bg-gray-50 relative inline-flex items-center justify-center no-underline transition-colors"
        >
          <span className="absolute left-3 w-8 h-8 inline-flex items-center justify-center">
            <img src="/icons/chrome.svg" alt="" width={20} height={20} />
          </span>
          Open in Chrome App
        </a>
      </div>
    </main>
  );
}
