import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Natuna Digilab, the design system for Indonesian digital products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "natuna-logo.svg"));
  const src = `data:image/svg+xml;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d121c",
          padding: 72,
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={96} height={96} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            The design system for Indonesian digital products
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#9aa4b2" }}>Natuna Digilab</div>
        </div>
      </div>
    ),
    size,
  );
}
