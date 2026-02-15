import { NextRequest, NextResponse } from "next/server";
import { repo } from "@/lib/repos/scheduledReviewsRepo";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token: unknown = body?.token;

    if (typeof token !== "string" || token.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid token" },
        { status: 400 }
      );
    }

    // Rate limit by IP (or token as fallback)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const rateLimitKey = `scan:${ip}:${token}`;

    if (await isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    // Validate the token exists and is active before logging
    const review = await repo.getByToken(token);
    if (!review || review.qrStatus === "Inactive") {
      return NextResponse.json(
        { ok: false, error: "Token not found or inactive" },
        { status: 404 }
      );
    }

    await repo.logScan(token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
