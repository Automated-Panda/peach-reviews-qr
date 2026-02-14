import { getCachedReview } from "@/lib/cache";
import ReviewPageClient from "./ReviewPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicReviewPage({ params }: Props) {
  const { token } = await params;
  // Reads from cache if provider already opened /p/[token] — no Airtable round-trip
  const review = await getCachedReview(token);

  if (!review || review.qrStatus === "Inactive") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-8 py-10 text-center">
          <h1 className="text-xl font-semibold text-[#202124] mb-2">
            Link Not Active
          </h1>
          <p className="text-[#5f6368]">
            This review link is no longer active. If you believe this is an
            error, please contact the business directly.
          </p>
        </div>
      </main>
    );
  }

  // Pass only the data the client component needs — no secrets leak
  return (
    <ReviewPageClient
      token={review.token}
      locationName={review.locationName}
      reviewContent={review.reviewContent}
      listingUrl={review.listingUrl}
      googlePlaceId={review.googlePlaceId}
    />
  );
}
