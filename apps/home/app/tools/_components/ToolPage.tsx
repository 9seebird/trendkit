// 도구 페이지 공통 틀 — 머리말·광고·설명 글·자주 묻는 질문·관련 도구.
// 도구 자체(입력·계산)는 각 페이지의 클라이언트 컴포넌트가 children 으로 들어온다.
// 설명 글과 FAQ 는 서버에서 그려 검색엔진이 읽을 수 있게 한다 (광고 승인·단가에도 중요).
import Link from "next/link";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import AdSenseAd from "../../_components/AdSenseAd";
import { TOOLS, toolBySlug } from "@/lib/tools";
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
  related?: string[];          // 관련 도구 slug (없으면 같은 묶음 → 나머지 순)
}) {
  const tool = toolBySlug(slug);
  const others = TOOLS.filter((t) => t.slug !== slug);
  const rel = (related?.map((s) => others.find((t) => t.slug === s)).filter(Boolean) as typeof TOOLS | undefined)
    ?? [...others.filter((t) => t.group === tool.group), ...others.filter((t) => t.group !== tool.group)];
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
          { "@type": "ListItem", position: 1, name: "TrendKit", item: SITE.url },
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
          <Link href="/">TrendKit</Link> › <Link href="/tools">도구</Link> › {tool.name}
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
            {rel.slice(0, 4).map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="tk-card">
                <span className="ic" style={{ background: t.iconBg }}>{t.icon}</span>
                <span><b>{t.name}</b><small>{t.short}</small></span>
              </Link>
            ))}
          </div>
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
