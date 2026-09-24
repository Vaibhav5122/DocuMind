import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DocuMind — Grounded AI Document Intelligence & RAG Chat";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.12) 35%, transparent 70%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 80px",
        }}
      >
        {/* Document Icon + Neural Nodes Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            padding: "16px 28px",
            borderRadius: "9999px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              marginRight: "14px",
              boxShadow: "0 0 16px #10B981",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#34D399",
              textTransform: "uppercase",
            }}
          >
            DocuMind AI • RAG 2.0 Engine
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "1000px",
            marginBottom: "24px",
          }}
        >
          Chat With Any Enterprise Document in Real-Time
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            color: "#9CA3AF",
            textAlign: "center",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          Instant streaming answers backed by Pinecone vector retrieval, intelligent chunking, and verified citations.
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: "18px",
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#E5E7EB",
            }}
          >
            ⚡ &lt; 320ms First Token
          </div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#E5E7EB",
            }}
          >
            🛡️ Zero-Hallucination Citations
          </div>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: "18px",
              fontWeight: 600,
              color: "#E5E7EB",
            }}
          >
            🌲 Pinecone Vector Indexing
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
