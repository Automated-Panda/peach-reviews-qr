import type { ScheduledReviewsRepo } from "./types";
import type { ScheduledReviewPublic } from "@/lib/types";
import seedData from "@/data/scheduledReviews.sample.json";

/**
 * Local (in-memory) implementation of ScheduledReviewsRepo.
 *
 * Loads from the sample JSON file at startup. logScan mutates the
 * in-memory array (no disk persistence — data resets on restart).
 */

const records: ScheduledReviewPublic[] = seedData as ScheduledReviewPublic[];

export const localRepo: ScheduledReviewsRepo = {
  async getByToken(token: string) {
    return records.find((r) => r.token === token) ?? null;
  },

  async logScan(token: string) {
    const record = records.find((r) => r.token === token);
    if (!record) return;
    record.qrScanCount += 1;
    record.lastQrScan = new Date().toISOString();
  },
};
