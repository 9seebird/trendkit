import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// /sitemap.xml — 구글 서치 콘솔·네이버 서치어드바이저에 이 주소를 제출한다
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/services", 0.9, "weekly"],
    ["/about", 0.6, "monthly"],
    ["/contact", 0.6, "weekly"],
    ["/privacy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
