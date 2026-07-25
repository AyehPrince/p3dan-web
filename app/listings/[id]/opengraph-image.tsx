import { ImageResponse } from "next/og";
import { fetchListingDetail } from "@/lib/listings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const listing = await fetchListingDetail(params.id);

  if (!listing) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0F6E56",
            fontSize: 48,
            color: "#EDE7DC",
          }}
        >
          p3dan
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#EDE7DC" }}>
        <div
          style={{
            width: "45%",
            height: "100%",
            display: "flex",
            backgroundColor: "#D3D1C7",
            backgroundImage: listing.imageUrl ? `url(${listing.imageUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            width: "55%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                borderBottomLeftRadius: 0,
                backgroundColor: "#0F6E56",
                transform: "rotate(-45deg)",
              }}
            />
            <div style={{ fontSize: 22, fontWeight: 700, color: "#2C2C2A" }}>p3dan</div>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#2C2C2A", marginBottom: 12, display: "flex" }}>
            {listing.title}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#993C1D", marginBottom: 16, display: "flex" }}>
            GHS {listing.price.toLocaleString()}/mo
          </div>
          <div style={{ fontSize: 22, color: "#5F5E5A", display: "flex" }}>
            {listing.area_name}, {listing.city} · {listing.room_type_name}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}