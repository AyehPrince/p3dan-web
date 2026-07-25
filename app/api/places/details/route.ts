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
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const searchParams = request.nextUrl.searchParams;
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    console.error("Places details error:", data.status, data.error_message);
    return NextResponse.json({ error: data.status }, { status: 500 });
  }

  return NextResponse.json({
    name: data.result.name,
    latitude: data.result.geometry.location.lat,
    longitude: data.result.geometry.location.lng,
  });
}