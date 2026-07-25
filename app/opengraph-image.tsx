import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "MakoBytes — Lightweight desktop tools for AI power users. Fast, private, no BS.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* subtle navy radial glow on the right */}
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0, 97, 170, 0.18) 0%, rgba(0, 97, 170, 0) 65%)",
            display: "flex",
          }}
        />

        {/* logo + wordmark row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: "50%",
              border: "5px solid #0061aa",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: "#0061aa",
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              M
            </div>
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#333333",
              letterSpacing: "-0.02em",
            }}
          >
            MakoBytes
          </div>
        </div>

        {/* spacer */}
        <div style={{ flexGrow: 1, display: "flex" }} />

        {/* big headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 102,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#0061aa",
              display: "flex",
            }}
          >
            Lightweight tools
          </div>
          <div
            style={{
              fontSize: 102,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#0061aa",
              marginTop: 8,
              display: "flex",
            }}
          >
            for AI power users.
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#555555",
              marginTop: 32,
              display: "flex",
            }}
          >
            Fast. Private. No BS. No bloat.
          </div>
        </div>

        {/* spacer */}
        <div style={{ flexGrow: 0.4, display: "flex" }} />

        {/* footer mono tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            color: "#777777",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#10b981",
              display: "flex",
            }}
          />
          makobytes.com · desktop studio
        </div>
      </div>
    ),
    { ...size },
  );
}
