import type { ScheduledReviewsRepo } from "./types";

/**
 * Airtable implementation of ScheduledReviewsRepo.
 *
 * TODO: Install Airtable SDK:  npm install airtable
 * TODO: Use env vars:
 *   - AIRTABLE_API_KEY
 *   - AIRTABLE_BASE_ID
 *   - AIRTABLE_TABLE_SCHEDULED_REVIEWS  (default "Scheduled Reviews")
 *
 * Field mapping (Airtable field name -> ScheduledReviewPublic key):
 *   "Public ID"        -> token
 *   "Platform Name"    -> platform
 *   "Business Name"    -> businessName
 *   "Client Website"   -> clientWebsite
 *   "Location Name"    -> locationName   (formula field, read-only)
 *   "Review Content"   -> reviewContent
 *   "Listing URL"      -> listingUrl
 *   "Google Place ID"  -> googlePlaceId
 *   "QR Scan Count"    -> qrScanCount
 *   "Last QR Scan"     -> lastQrScan
 *   "QR Status"        -> qrStatus
 *
 * getByToken:
 *   - filterByFormula: `{Public ID} = 'TOKEN'`
 *   - Return first match, mapped to ScheduledReviewPublic
 *
 * logScan:
 *   - Find record by Public ID
 *   - PATCH: { "QR Scan Count": current + 1, "Last QR Scan": new Date().toISOString() }
 */

export const airtableRepo: ScheduledReviewsRepo = {
  async getByToken(_token: string) {
    // TODO: implement Airtable lookup
    throw new Error(
      "Airtable repo not implemented. Set DATA_SOURCE=local or implement this module."
    );
  },

  async logScan(_token: string) {
    // TODO: implement Airtable update (increment QR Scan Count, set Last QR Scan)
    throw new Error(
      "Airtable repo not implemented. Set DATA_SOURCE=local or implement this module."
    );
  },
};
