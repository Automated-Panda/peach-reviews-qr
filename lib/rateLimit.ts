/**
 * Lightweight in-memory rate limiter.
 *
 * CAVEAT: On Vercel (serverless), each function invocation may run in a
 * separate instance, so this Map won't be shared across instances and
 * resets on cold starts. This is fine for local dev.
 *
 * For production, swap this out with Upstash Redis + @upstash/ratelimit:
 *   npm install @upstash/ratelimit @upstash/redis
 *
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 *   const ratelimit = new Ratelimit({
 *     redis: Redis.fromEnv(),
 *     limiter: Ratelimit.slidingWindow(10, "60 s"),
 *   });
 */

const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_HITS = 10; // max requests per window per key

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(key) ?? [];

  // Prune entries outside the window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}
