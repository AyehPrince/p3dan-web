import { NextRequest, NextResponse } from "next/server";

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS;
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ predictions: [] }, { status: 429 });
  }

  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&components=country:gh&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("Places autocomplete error:", data.status, data.error_message);
    return NextResponse.json({ predictions: [] });
  }

  return NextResponse.json({
    predictions: (data.predictions || []).map((p: any) => ({
      placeId: p.place_id,
      description: p.description,
    })),
  });
}