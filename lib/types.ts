/**
 * Public-facing review record delivered via QR code.
 *
 * Airtable field mapping (table: "Scheduled Reviews"):
 *   token         -> "Public ID"          (Single line text)
 *   platform      -> "Platform Name"      (Single line text)
 *   locationName  -> "Location Name"      (Formula: {Client} - {Platform} - {Listing Group})
 *   reviewContent -> "Review Content"     (Long text)
 *   listingUrl    -> "Listing URL"        (URL)
 *   googlePlaceId -> "Google Place ID"    (Single line text, optional)
 *   qrScanCount   -> "QR Scan Count"      (Number)
 *   lastQrScan    -> "Last QR Scan"       (Date/Time)
 *   qrStatus      -> "QR Status"          (Single select: Active | Inactive)
 *
 * Not stored in app (Airtable-only):
 *   "Provider QR Link" (URL, formula pointing to /p/:token)
 */

export type Platform =
  | "Google"
  | "Yelp"
  | "Trustpilot"
  | "Tripadvisor"
  | "Healthgrades"
  | (string & {});

export interface ScheduledReviewPublic {
  token: string;
  platform: Platform;
  locationName: string;
  reviewContent: string;
  listingUrl: string;
  googlePlaceId?: string;
  qrStatus: "Active" | "Inactive";
  qrScanCount: number;
  lastQrScan?: string; // ISO 8601
}
