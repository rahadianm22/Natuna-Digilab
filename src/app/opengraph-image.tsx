import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Natuna Digilab, the design system for Indonesian digital products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Urbanist as TrueType, fetched at build time. Google serves TrueType only when no browser User-Agent is sent,
// and Satori cannot read woff2. If the request fails the image still renders in the default font.
async function urbanist(weight: number) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Urbanist:wght@${weight}`)).text();
    const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "natuna-logo.svg"));
  const src = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const [bold, medium] = await Promise.all([urbanist(800), urbanist(500)]);
  const fonts = [
    ...(bold ? [{ name: "Urbanist", data: bold, weight: 800 as const }] : []),
    ...(medium ? [{ name: "Urbanist", data: medium, weight: 500 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#19212e",
          padding: 72,
          color: "#ffffff",
          fontFamily: fonts.length ? "Urbanist" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={96} height={96} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 900, letterSpacing: -2 }}>
            The design system for Indonesian digital products
          </div>
          <div style={{ marginTop: 28, fontSize: 30, fontWeight: 500, color: "#9aa4b2" }}>Natuna Digilab</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
