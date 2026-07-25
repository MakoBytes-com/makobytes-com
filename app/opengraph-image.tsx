import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "MakoBytes — Desktop software, built like precision instruments. Fast, private, no BS.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The OG card is a miniature engineering drawing: paper grid, navy ink,
   a dimensioned headline, and the title block in the bottom-right —
   same language as the site itself. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          backgroundImage:
            "linear-gradient(rgba(0,97,170,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,97,170,0.05) 1px, transparent 1px), linear-gradient(rgba(0,97,170,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(0,97,170,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* drawing frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid #26303b",
            display: "flex",
          }}
        />

        {/* brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#ffffff",
              border: "4px solid #0061aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0061aa",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#26303b" }}>MakoBytes</div>
            <div style={{ fontSize: 14, letterSpacing: 5, color: "#6b7684" }}>
              DESKTOP SOFTWARE WORKS — SPEC SHEET Nº 001
            </div>
          </div>
        </div>

        {/* headline */}
        <div
          style={{
            marginTop: 64,
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: "#111b26",
          }}
        >
          <div style={{ display: "flex" }}>Software, built like</div>
          <div style={{ display: "flex", color: "#0061aa" }}>precision instruments.</div>
        </div>

        {/* spec chips */}
        <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
          {["SIGNED BINARIES", "100% ON-DEVICE", "PIXELCOPY · MAKOBOT"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: "#0061aa",
                  transform: "rotate(45deg)",
                  display: "flex",
                }}
              />
              <div style={{ fontSize: 17, letterSpacing: 3, color: "#4d5a68" }}>{t}</div>
            </div>
          ))}
        </div>

        {/* title block, bottom-right */}
        <div
          style={{
            position: "absolute",
            right: 28,
            bottom: 28,
            display: "flex",
            border: "2px solid #26303b",
            borderRight: "none",
            borderBottom: "none",
            background: "#ffffff",
          }}
        >
          {[
            ["DRAWN BY", "MAKOBYTES"],
            ["REV", "2026.07"],
            ["SCALE", "1:1"],
            ["STATUS", "RELEASED"],
          ].map(([k, v], i) => (
            <div
              key={k}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "12px 20px",
                borderLeft: i > 0 ? "1.5px solid #26303b" : "none",
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#6b7684" }}>{k}</div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: v === "RELEASED" ? "#10B981" : "#26303b",
                  marginTop: 4,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
