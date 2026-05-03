import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          borderRadius: "22%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "76%",
            height: "76%",
            borderRadius: "50%",
            border: "10px solid #0061aa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              color: "#0061aa",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            M
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
