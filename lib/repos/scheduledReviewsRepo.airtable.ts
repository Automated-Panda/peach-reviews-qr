import Airtable from "airtable";
import type { ScheduledReviewsRepo } from "./types";
import type { ScheduledReviewPublic } from "@/lib/types";

/**
 * Airtable implementation of ScheduledReviewsRepo.
 *
 * Field mapping (Airtable field name -> ScheduledReviewPublic key):
 *   "Public ID"        -> token
 *   "Platform Name"    -> platform
 *   "Business Name"    -> businessName
 *   "Client Website"   -> clientWebsite
 *   "Review Content"   -> reviewContent
 *   "Listing URL"      -> listingUrl
 *   "Google Place ID"  -> googlePlaceId
 *   "QR Scan Count"    -> qrScanCount
 *   "Last QR Scan"     -> lastQrScan
 *   "QR Status"        -> qrStatus
 */

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!
);

const table = base(
  process.env.AIRTABLE_TABLE_SCHEDULED_REVIEWS ?? "Scheduled Reviews"
);

/** Unwrap a field value that may be a single value or a lookup array. */
function unwrap(value: unknown): string {
  if (Array.isArray(value)) return (value[0] as string) ?? "";
  return (value as string) ?? "";
}

function mapRecord(record: Airtable.Record<Airtable.FieldSet>): ScheduledReviewPublic {
  const f = record.fields;
  return {
    token: unwrap(f["Public ID"]),
    platform: unwrap(f["Platform Name"]) || "Google",
    businessName: unwrap(f["Business Name"]),
    clientWebsite: unwrap(f["Client Website"]) || undefined,
    reviewContent: unwrap(f["Review Content"]),
    listingUrl: unwrap(f["Listing URL"]),
    googlePlaceId: unwrap(f["Google Place ID"]) || undefined,
    qrScanCount: (f["QR Scan Count"] as number) ?? 0,
    lastQrScan: unwrap(f["Last QR Scan"]) || undefined,
    qrStatus: (unwrap(f["QR Status"]) as "Active" | "Inactive") || "Inactive",
  };
}

export const airtableRepo: ScheduledReviewsRepo = {
  async getByToken(token: string) {
    const records = await table
      .select({
        filterByFormula: `{Public ID} = '${token.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;
    return mapRecord(records[0]);
  },

  async logScan(token: string) {
    const records = await table
      .select({
        filterByFormula: `{Public ID} = '${token.replace(/'/g, "\\'")}'`,
        maxRecords: 1,
        fields: ["QR Scan Count"],
      })
      .firstPage();

    if (records.length === 0) return;

    const record = records[0];
    const currentCount = (record.fields["QR Scan Count"] as number) ?? 0;

    await table.update(record.id, {
      "QR Scan Count": currentCount + 1,
      "Last QR Scan": new Date().toISOString(),
    });
  },
};
