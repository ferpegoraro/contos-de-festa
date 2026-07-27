import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Miniatura que aparece ao compartilhar o link (WhatsApp, Instagram, etc.). */
export const alt = "Contos de Festas — Pegue & Monte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public/logo-transparente.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
          background:
            "linear-gradient(135deg, #722e43 0%, #5a2435 55%, #2d1a22 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width={220} height={219} alt="" />

        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Contos de Festas
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 14,
            textTransform: "uppercase",
            color: "#e8a0b4",
          }}
        >
          Pegue &amp; Monte
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 26,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Aluguel de kits de decoração para festas
        </div>
      </div>
    ),
    { ...size },
  );
}
