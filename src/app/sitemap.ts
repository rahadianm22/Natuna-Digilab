import type { MetadataRoute } from "next";
import { components } from "@/lib/components-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/docs", "/foundation", "/components", "/themes", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}` })),
    ...components.map((c) => ({ url: `${SITE_URL}/components/${c.slug}` })),
  ];
}
