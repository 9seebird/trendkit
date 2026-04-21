// 홈페이지 — Hero 카드 텍스트 말줄임 → 2줄 허용으로 수정
import React from "react";
import Link from "next/link";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { URLS } from "@/lib/urls";

const HERO_TOOLS = [
  {
    icon: "📊",
    iconBg: "#dbeafe",
    name: "Excel Smart Merger",
    desc: "여러 엑셀 파일을 컬럼 기반으로 스마트하게 병합. 컬럼 매핑, 미리보기, 다운로드까지.",
    href: URLS.excel,
    status: "live" as const,
    external: true,
  },
  {
    icon: "☁️",
    iconBg: "#dbeafe",
    name: "워드클라우드 생성기",
    desc: "검색어 기반 뉴스 수집 후 워드클라우드 생성. 이미지·CSV 다운로드 지원.",
    href: URLS.wordcloud,
    status: "live" as const,
    external: true,
  },
  {
    icon: "📈",
    iconBg: "#dcfce7",
    name: "키워드 트렌드",
    desc: "오늘 뉴스 키워드 빈도 분석. 바 차트와 태그 클라우드로 시각화.",
    href: URLS.trends,
    status: "live" as const,
    external: true,
  },
];

export default function HomePage() {
  return (
    <>
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
                  <Link href="/services" className="btn btn-dark">
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

        {/* ══ 서비스 미리보기 ══ */}
        <section
          className="section-pad"
          style={{ background: "var(--bg-page)" }}
        >
          <div className="container-main">
            <div
              style={{
                textAlign: "center",
                marginBottom: "clamp(32px, 5vw, 52px)",
              }}
            >
              <span className="section-eyebrow">Our Services</span>
              <h2 className="section-title">생산성 도구 모음</h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                복잡한 설치 없이 브라우저에서 바로 사용하는 웹 기반 도구들
              </p>
            </div>

            <div className="grid-cards">
              {HERO_TOOLS.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  target={tool.external ? "_blank" : undefined}
                  rel={tool.external ? "noopener noreferrer" : undefined}
                  className="card"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div className="icon-box" style={{ background: tool.iconBg }}>
                    {tool.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      marginBottom: "10px",
                    }}
                  >
                    {tool.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    {tool.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        background: "var(--status-live-bg)",
                        color: "var(--status-live-text)",
                      }}
                    >
                      Live
                    </span>
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "18px" }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/services" className="btn btn-outline">
                모든 서비스 보기
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
