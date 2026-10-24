// 도구 페이지 공통 틀 — 머리말·광고·설명 글·자주 묻는 질문·관련 도구.
// 도구 자체(입력·계산)는 각 페이지의 클라이언트 컴포넌트가 children 으로 들어온다.
// 설명 글과 FAQ 는 서버에서 그려 검색엔진이 읽을 수 있게 한다 (광고 승인·단가에도 중요).
import Link from "next/link";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import AdSenseAd from "../../_components/AdSenseAd";
import { toolBySlug } from "@/lib/tools";
import { CATALOG_SORTED } from "@/lib/catalog";
import ToolCard from "../../_components/ToolCard";
import { SITE } from "@/lib/site";

export type FAQ = { q: string; a: string };

export default function ToolPage({
  slug, lead, children, article, faq, related,
}: {
  slug: string;
  lead: string;
  children: React.ReactNode;
  article: React.ReactNode;
  faq: FAQ[];
  related?: string[];          // 관련 도구 key (사이트 안 도구는 slug, 외부는 pdf·trip 등). 없으면 같은 분류 → 추천 순
}) {
  const tool = toolBySlug(slug);
  const others = CATALOG_SORTED.filter((c) => c.key !== slug);
  const picked = (related ?? []).map((k) => others.find((c) => c.key === k)).filter((c): c is (typeof others)[number] => !!c);
  // 고른 것 → 같은 분류 → 추천 순으로 4개 (외부 서비스도 섞어 사이트 전체로 이어지게)
  const rel = [...picked, ...others.filter((c) => c.category === tool.group), ...others]
    .filter((c, i, a) => a.findIndex((x) => x.key === c.key) === i).slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication", name: tool.name, url: `${SITE.url}/tools/${slug}`,
        description: tool.short, applicationCategory: "UtilitiesApplication", operatingSystem: "Web",
        inLanguage: "ko-KR", offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "도구", item: `${SITE.url}/tools` },
          { "@type": "ListItem", position: 3, name: tool.name, item: `${SITE.url}/tools/${slug}` },
        ],
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="tk-wrap">
        <nav className="tk-crumb" aria-label="현재 위치">
          <Link href="/">홈</Link> › <Link href="/tools">도구</Link> › {tool.name}
        </nav>
        <h1 className="tk-title">{tool.icon} {tool.name}</h1>
        <p className="tk-lead">{lead}</p>

        {children}

        <AdSenseAd label={`${tool.name} 광고`} />

        <article className="tk-article">{article}</article>

        {faq.length > 0 && (
          <section className="tk-faq tk-article">
            <h2>자주 묻는 질문</h2>
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        )}

        <section className="tk-related">
          <h2>함께 쓰면 좋은 도구</h2>
          <div className="tk-cards">
            {rel.map((c) => <ToolCard key={c.key} item={c} compact />)}
          </div>
          <p style={{ marginTop: 14 }}><Link href="/tools" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>전체 도구 보기 →</Link></p>
        </section>
      </main>
      <Footer />
    </>
  );
}

// 각 도구 페이지의 메타데이터를 같은 모양으로
export function toolMetadata(slug: string, title: string, description: string) {
  const t = toolBySlug(slug);
  return {
    title,
    description,
    keywords: t.keywords,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: { title: `${title} | TrendKit`, description, url: `/tools/${slug}` },
  };
}
