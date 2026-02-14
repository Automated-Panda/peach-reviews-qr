import { notFound } from "next/navigation";
import { getCachedReview } from "@/lib/cache";
import GooglePoster from "@/components/poster/google/GooglePoster";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ProviderPosterPage({ params }: Props) {
  const { token } = await params;
  // This call warms the cache so /r/[token] loads instantly when QR is scanned
  const review = await getCachedReview(token);

  if (!review) {
    notFound();
  }

  // Show inactive state for providers
  if (review.qrStatus === "Inactive") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full px-8 py-10 text-center">
          <h1 className="text-xl font-semibold text-[#202124] mb-2">
            QR Code Inactive
          </h1>
          <p className="text-[#5f6368]">
            This QR code has been deactivated. If you believe this is an error,
            please contact support.
          </p>
        </div>
      </main>
    );
  }

  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const qrUrl = `${baseUrl}/r/${token}`;

  // Future: switch on review.platform for per-platform poster components
  // e.g. if (review.platform === "Yelp") return <YelpPoster ... />;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 print:p-0 print:bg-white">
      <GooglePoster qrUrl={qrUrl} businessName={review.businessName} />
    </main>
  );
}
