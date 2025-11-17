// src/components/SpinnerOverlay.jsx
import React from "react";

/**
 * Overlay de loading com spinner central.
 * Props:
 *  - open: boolean
 *  - message: string (opcional)
 */
export default function SpinnerOverlay({ open = false, message = "Carregando…" }) {
  if (!open) return null;

  // cor rosa da paleta (coerente com o design usado no admin)
  const rose = "#D1A0A0";

  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        role="status"
        aria-label={message}
        style={{
          minWidth: 220,
          maxWidth: 360,
          padding: 20,
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 40,
            display: "grid",
            placeItems: "center",
            flex: "0 0 48px",
            position: "relative",
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              width: 44,
              height: 44,
              borderRadius: 44,
              border: `4px solid rgba(0,0,0,0.06)`,
              borderTopColor: rose,
              animation: "spinner-rotate 1s linear infinite",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#333", marginBottom: 4 }}>
            {message}
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Aguarde um instante...
          </div>
        </div>

        <style>{`
          @keyframes spinner-rotate {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
