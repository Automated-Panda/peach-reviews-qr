/**
 * Build the best Google Maps link for a listing.
 *
 * Priority:
 * 1. If googlePlaceId exists, use Google Maps search with place_id query param.
 * 2. Otherwise fall back to the raw listingUrl.
 *
 * The iOS Google Maps app URL scheme (comgooglemaps://) is attempted
 * client-side in the review page component so we can feature-detect.
 */

export function buildMapsWebUrl(opts: {
  googlePlaceId?: string;
  listingUrl: string;
}): string {
  if (opts.googlePlaceId) {
    return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(opts.googlePlaceId)}`;
  }
  return opts.listingUrl;
}

/**
 * Build an iOS Google Maps app deep-link (comgooglemaps:// scheme).
 * Returns null if no googlePlaceId is available (scheme requires it).
 */
export function buildMapsAppUrl(googlePlaceId?: string): string | null {
  if (!googlePlaceId) return null;
  return `comgooglemaps://?q=place_id:${encodeURIComponent(googlePlaceId)}`;
}
