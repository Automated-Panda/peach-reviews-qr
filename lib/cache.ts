import { unstable_cache } from "next/cache";
import { repo } from "@/lib/repos/scheduledReviewsRepo";
import type { ScheduledReviewPublic } from "@/lib/types";

/**
 * Cached wrapper around repo.getByToken().
 *
 * How it works with QR flow:
 * 1. Provider opens /p/[token] → getCachedReview(token) → fetches from
 *    data source (Airtable later), result is cached.
 * 2. End-user scans QR → /r/[token] → getCachedReview(token) → served
 *    from cache instantly, no Airtable round-trip.
 *
 * Cache key: ["review", token]
 * TTL: 24 hours (review content doesn't change once created)
 *
 * On Vercel, unstable_cache persists across serverless invocations via
 * their Data Cache infrastructure. Locally it persists for the dev
 * server lifetime.
 */
export const getCachedReview = unstable_cache(
  async (token: string): Promise<ScheduledReviewPublic | null> => {
    return repo.getByToken(token);
  },
  ["review"],
  { revalidate: 86_400 } // 24 hours
);
