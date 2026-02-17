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
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(opts.googlePlaceId)}`;
  }
  return opts.listingUrl;
}

/**
 * Resolve a shortened Google URL (share.google/*, maps.app.goo.gl/*)
 * to its final destination by following redirects server-side.
 *
 * The resolved URL (e.g. maps.google.com/maps?q=...) triggers universal
 * links on mobile, opening the Google Maps app directly.
 *
 * Returns the original URL if resolution fails or it's already a full URL.
 */
const SHORTENER_HOSTS = ["share.google", "maps.app.goo.gl", "goo.gl"];

export async function resolveListingUrl(url: string): Promise<string> {
  try {
    const hostname = new URL(url).hostname;
    if (!SHORTENER_HOSTS.includes(hostname)) return url;

    // Follow redirects to get the final destination URL.
    const response = await fetch(url, { redirect: "follow" });
    const finalUrl = response.url;

    // maps.app.goo.gl links resolve to maps.google.com with ftid (exact listing).
    // These work perfectly with universal links on mobile → opens Maps app.
    // share.google links resolve to google.com/search — less precise, but
    // still functional as a fallback until the URL is replaced with a Maps link.
    return finalUrl || url;
  } catch {
    return url;
  }
}
