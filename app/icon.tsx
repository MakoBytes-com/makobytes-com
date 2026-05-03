import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "16px solid #0061aa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 168,
            fontWeight: 900,
            color: "#0061aa",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size },
  );
}
