import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /robots.txt — 관리 화면과 API 는 검색에 안 나오게
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
