import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F6E56",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              borderBottomLeftRadius: 0,
              backgroundColor: "#D85A30",
              transform: "rotate(-45deg)",
            }}
          />
          <div style={{ fontSize: 56, fontWeight: 700, color: "#EDE7DC" }}>p3dan</div>
        </div>
        <div style={{ fontSize: 30, color: "#9FE1CB", textAlign: "center", maxWidth: 800 }}>
          Find rooms and apartments to rent in Ghana
        </div>
      </div>
    ),
    { ...size }
  );
}