// 홈페이지 — Hero 카드 텍스트 말줄임 → 2줄 허용으로 수정
import React from "react";
import Link from "next/link";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import AdSenseAd from "./_components/AdSenseAd";
import AdFitAd from "./_components/AdFitAd";
import { SITE } from "@/lib/site";
import { CATALOG, FEATURED } from "@/lib/catalog";
import CatalogGrid from "./_components/CatalogGrid";

// 구조화 데이터 — 검색 결과에서 사이트 이름·도구 목록을 알아보게 (schema.org)
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", name: SITE.name, url: SITE.url, inLanguage: "ko-KR", description: SITE.description },
    {
      "@type": "ItemList",
      name: "TrendKit 도구 모음",
      itemListElement: CATALOG.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "WebApplication", name: t.name, url: t.external ? t.href : `${SITE.url}${t.href}`, description: t.short,
                applicationCategory: "UtilitiesApplication", operatingSystem: "Web",
                offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" } },
      })),
    },
  ],
};

// 첫 화면 오른쪽 카드 — 추천 도구 4개 (lib/catalog.ts 의 featured 순서)
const HERO_TOOLS = FEATURED.slice(0, 4).map((c) => ({
  icon: c.icon, iconBg: c.iconBg, name: c.name, desc: c.short, href: c.href,
  status: "live" as const, external: c.external,
}));

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Header />
      <main>
        {/* ══ HERO ══ */}
        <section
          className="hero-section"
          style={{
            /* 상단 헤더 높이만큼 밀어주는 역할만 유지 */
            paddingTop: "var(--nav-height)",

            /* 배경은 그대로 유지 */
            background:
              "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 45%, #f0ede8 100%)",

            /* 배경 효과용 absolute 요소가 있으므로 relative 유지 */
            position: "relative",

            /* 좌우 삐져나옴 방지 */
            overflow: "hidden",
          }}
        >
          {/* 우측 상단 은은한 배경 원형 효과 */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-80px",
              width: "500px",
              height: "500px",
              pointerEvents: "none",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
            }}
          />

          {/* 실제 내용 영역
      - width 100%만 유지
      - 여백(padding)은 globals.css의 .hero-inner가 담당 */}
          <div className="hero-inner container-main" style={{ width: "100%" }}>
            <div className="grid-2col">
              {/* 왼쪽: 텍스트 */}
              <div>
                <span className="section-eyebrow">PRODUCTIVITY TOOLS</span>

                <h1
                  style={{
                    fontSize: "clamp(34px, 5.5vw, 64px)",
                    lineHeight: 1.08,
                    letterSpacing: "-1.5px",
                    color: "var(--text-primary)",
                    marginBottom: "20px",
                    fontWeight: 700,
                  }}
                >
                  더 빠르게,
                  <br />
                  <span style={{ color: "var(--brand)" }}>더 스마트하게</span>
                  <br />
                  일하세요
                </h1>

                <p
                  style={{
                    fontSize: "clamp(15px, 2vw, 17px)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    marginBottom: "52px",
                    maxWidth: "400px",
                  }}
                >
                  반복적인 업무를 자동화하는 웹 도구 모음.
                  <br />
                  설치 없이 브라우저에서 바로 사용하세요.
                </p>

                <div
                  className="btn-group"
                  style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                >
                  <Link href="/tools" className="btn btn-dark">
                    도구 둘러보기 →
                  </Link>
                  <Link href="/about" className="btn btn-outline">
                    소개 보기
                  </Link>
                </div>
              </div>

              {/* 오른쪽: 도구 카드 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {HERO_TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="card"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      padding: "18px 20px",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* 아이콘 */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "12px",
                        background: tool.iconBg,
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {tool.icon}
                    </div>

                    {/* 텍스트 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {tool.name}
                      </div>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tool.desc}
                      </div>
                    </div>

                    {/* 상태 뱃지 */}
                    <span
                      className="badge"
                      style={{
                        background: "var(--status-live-bg)",
                        color: "var(--status-live-text)",
                        flexShrink: 0,
                      }}
                    >
                      Live
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container-main home-after-hero-ad">
          <AdSenseAd label="홈 상단 광고" />
        </div>

        {/* ══ 서비스 미리보기 ══ */}
        {/* 전체 도구 — 분류 탭 + 카드 (도구 목록 페이지와 같은 부품) */}
        <section className="section-pad">
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="section-eyebrow">All Tools</span>
              <h2 className="section-title">자주 쓰는 도구 모음</h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                문서·파일 정리부터 계산기, 뉴스 분석, 여행 코스까지 설치 없이 바로
              </p>
            </div>
            <CatalogGrid limit={8} />
            <div style={{ textAlign: "center", marginTop: "36px" }}>
              <Link href="/tools" className="btn btn-outline">전체 도구 {CATALOG.length}개 보기</Link>
            </div>
          </div>
        </section>
        <div className="container-main home-footer-ad">
          <AdSenseAd label="홈 하단 광고" />
          {/* 카카오 애드핏 (매체: trendkit) */}
          <AdFitAd label="홈 하단 광고" style={{ margin: "24px auto" }} />
        </div>
      </main>
      <Footer />
    </>
  );
}
