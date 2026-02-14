import type { ScheduledReviewPublic } from "@/lib/types";

/**
 * Repository interface for Scheduled Reviews.
 * Implementations: local (JSON file) and airtable (future).
 */
export interface ScheduledReviewsRepo {
  /** Look up a review by its public token. Returns null if not found. */
  getByToken(token: string): Promise<ScheduledReviewPublic | null>;

  /** Increment scan count and set last-scanned timestamp. */
  logScan(token: string): Promise<void>;
}
