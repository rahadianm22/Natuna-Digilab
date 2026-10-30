import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The pages are static, and a nonce needs a fresh render per request, so script-src keeps 'unsafe-inline' for the
// inline hydration payload and the theme script in layout.tsx. Everything else is locked to this origin: no third-party
// script, style, font, frame, form target, <base>, plugin, or XHR can load. Development needs eval and a websocket for
// hot reload, so the policy only ships in production builds.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Superseded by frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // The site reads nothing from the device. Copy to Figma and the copy buttons write to the clipboard, so that stays on.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), interest-cohort=(), clipboard-write=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
