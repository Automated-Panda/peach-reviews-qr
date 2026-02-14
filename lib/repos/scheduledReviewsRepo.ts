import type { ScheduledReviewsRepo } from "./types";
import { localRepo } from "./scheduledReviewsRepo.local";
import { airtableRepo } from "./scheduledReviewsRepo.airtable";

/**
 * Factory: returns the active repo based on DATA_SOURCE env var.
 * Default is "local".
 */
function getRepo(): ScheduledReviewsRepo {
  const source = process.env.DATA_SOURCE ?? "local";

  switch (source) {
    case "airtable":
      return airtableRepo;
    case "local":
    default:
      return localRepo;
  }
}

export const repo = getRepo();
