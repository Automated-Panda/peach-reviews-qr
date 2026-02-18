/**
 * Build the best Google Maps link for a listing.
 *
 * Priority:
 * 1. If googlePlaceId exists, use the direct Google review URL.
 * 2. Otherwise fall back to the listingUrl (with tracking params stripped).
 */

/** Google tracking params that trigger bot detection when reused. */
const STRIP_PARAMS = ["entry", "g_ep", "skid"];

export function buildMapsWebUrl(opts: {
  googlePlaceId?: string;
  listingUrl: string;
}): string {
  if (opts.googlePlaceId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(opts.googlePlaceId)}`;
  }
  try {
    const url = new URL(opts.listingUrl);
    STRIP_PARAMS.forEach((p) => url.searchParams.delete(p));
    return url.toString();
  } catch {
    return opts.listingUrl;
  }
}

/**
 * Deep-link URLs that open in specific apps.
 *
 * iOS uses custom URL schemes (comgooglemaps://, google://, googlechromes://).
 * Android uses intent:// URIs with package names.
 */

type Platform = "ios" | "android";

function toIntent(webUrl: string, pkg: string): string {
  const withoutScheme = webUrl.replace(/^https:\/\//i, "");
  return `intent://${withoutScheme}#Intent;scheme=https;package=${pkg};end`;
}

/** Google Maps app. */
export function buildGoogleMapsAppUrl(
  opts: { googlePlaceId?: string; businessName: string; webUrl: string; platform: Platform },
): string {
  if (opts.platform === "android") {
    return toIntent(opts.webUrl, "com.google.android.apps.maps");
  }
  if (opts.googlePlaceId) {
    return `comgooglemaps://?q=place_id:${encodeURIComponent(opts.googlePlaceId)}`;
  }
  return `comgooglemaps://?q=${encodeURIComponent(opts.businessName)}`;
}

/** Google app. */
export function buildGoogleAppUrl(webUrl: string, platform: Platform): string {
  if (platform === "android") {
    return toIntent(webUrl, "com.google.android.googlequicksearchbox");
  }
  return `google://open-url?url=${encodeURIComponent(webUrl)}`;
}

/** Chrome browser. */
export function buildChromeUrl(webUrl: string, platform: Platform): string {
  if (platform === "android") {
    return toIntent(webUrl, "com.android.chrome");
  }
  return webUrl.replace(/^https:\/\//i, "googlechromes://");
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

    const response = await fetch(url, { redirect: "follow" });
    const finalUrl = response.url;
    if (!finalUrl) return url;

    // Strip tracking params that trigger bot detection when reused.
    const parsed = new URL(finalUrl);
    STRIP_PARAMS.forEach((p) => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Look up a Google Place ID for a business using the Places API (New).
 * Returns undefined if the API key isn't configured or the lookup fails.
 */
export async function lookupPlaceId(
  businessName: string,
): Promise<string | undefined> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return undefined;

  try {
    const res = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id",
        },
        body: JSON.stringify({ textQuery: businessName }),
      },
    );

    if (!res.ok) return undefined;

    const data = (await res.json()) as {
      places?: { id: string }[];
    };
    return data.places?.[0]?.id;
  } catch {
    return undefined;
  }
}
