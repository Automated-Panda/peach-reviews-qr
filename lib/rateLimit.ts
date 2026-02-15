import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash Redis rate limiter (production)
// Falls back to in-memory limiter when UPSTASH env vars are not set.
// ---------------------------------------------------------------------------

const upstashRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "60 s"),
      })
    : null;

// ---------------------------------------------------------------------------
// In-memory fallback (local dev)
// ---------------------------------------------------------------------------

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 10;

function isRateLimitedLocal(key: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(key) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function isRateLimited(key: string): Promise<boolean> {
  if (upstashRatelimit) {
    const { success } = await upstashRatelimit.limit(key);
    return !success;
  }
  return isRateLimitedLocal(key);
}
