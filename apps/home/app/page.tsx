// ─────────────────────────────────────────────────────
// 홈페이지 (/)
// 구성:
// 1) Hero 섹션
// 2) 서비스 미리보기 섹션
//
// 이번 수정 반영 내용:
// - "더 스마트하게" 기울임 제거
// - Hero 우측 카드 3개 가로 길이 통일
// - 카드 설명 텍스트를 slice 잘라내기 대신 CSS 말줄임 처리
// - 기존 구조는 유지하면서 보기 좋게 정리
// ─────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { URLS } from "@/lib/urls";

// ─────────────────────────────────────────────────────
// Hero 우측에 표시되는 도구 미리보기 카드 데이터
// 홈에서만 보여줄 목록입니다.
// ─────────────────────────────────────────────────────
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
        {/* ─────────────────────────────────────────────
            HERO 섹션
            - 왼쪽: 메인 문구 + 버튼
            - 오른쪽: 도구 미리보기 카드
           ───────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "100vh",
            paddingTop: "var(--nav-height)",
            background:
              "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 45%, #f0ede8 100%)",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 배경 장식용 글로우 */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              right: "-80px",
              width: "500px",
              height: "500px",
              background:
                "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            className="container-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* ── 왼쪽: Hero 텍스트 영역 ── */}
            <div>
              {/* 상단 라벨 */}
              <span className="section-eyebrow">PRODUCTIVITY TOOLS</span>

              {/* 메인 타이틀
                  - 기존 em 태그 italic 때문에 "더 스마트하게"가 기울어졌던 부분 수정
                  - span으로 바꿔서 색만 강조하고 기울임 제거 */}
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(42px, 5.5vw, 64px)",
                  lineHeight: 1.08,
                  letterSpacing: "-1.5px",
                  color: "var(--text-primary)",
                  marginBottom: "24px",
                }}
              >
                더 빠르게,
                <br />
                <span
                  style={{
                    fontStyle: "normal",
                    color: "var(--brand)",
                    display: "inline-block",
                  }}
                >
                  더 스마트하게
                </span>
                <br />
                일하세요
              </h1>

              {/* 서브 설명문 */}
              <p
                style={{
                  fontSize: "17px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.75,
                  marginBottom: "40px",
                  maxWidth: "400px",
                }}
              >
                반복적인 업무를 자동화하는 웹 도구 모음.
                <br />
                설치 없이 브라우저에서 바로 사용하세요.
              </p>

              {/* CTA 버튼 영역 */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Link href="/services" className="btn btn-dark">
                  도구 둘러보기 →
                </Link>

                <Link href="/about" className="btn btn-outline">
                  소개 보기
                </Link>
              </div>
            </div>

            {/* ── 오른쪽: 도구 미리보기 카드 목록 ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                width: "100%",
              }}
            >
              {HERO_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "var(--shadow-sm)",
                    width: "100%",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                >
                  {/* 아이콘 영역 */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "14px",
                      background: tool.iconBg,
                      fontSize: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tool.icon}
                  </div>

                  {/* 텍스트 영역
                      minWidth: 0 을 넣어야 text-overflow가 정상 동작합니다. */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      {tool.name}
                    </div>

                    {/* 기존 slice(0, 32) 제거
                        카드 너비 기준으로 자연스럽게 말줄임 처리 */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tool.desc}
                    </div>
                  </div>

                  {/* 상태 뱃지 */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "6px 12px",
                      borderRadius: "var(--radius-full)",
                      background:
                        tool.status === "live"
                          ? "var(--status-live-bg)"
                          : "var(--status-soon-bg)",
                      color:
                        tool.status === "live"
                          ? "var(--status-live-text)"
                          : "var(--status-soon-text)",
                      flexShrink: 0,
                    }}
                  >
                    {tool.status === "live" ? "Live" : "Soon"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────
            서비스 미리보기 섹션
           ───────────────────────────────────────────── */}
        <section
          className="section-pad"
          style={{ background: "var(--bg-page)" }}
        >
          <div className="container-main">
            {/* 섹션 헤더 */}
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <span className="section-eyebrow">Our Services</span>
              <h2 className="section-title">생산성 도구 모음</h2>
              <p className="section-desc" style={{ margin: "0 auto" }}>
                복잡한 설치 없이 브라우저에서 바로 사용하는 웹 기반 도구들
              </p>
            </div>

            {/* 서비스 카드 그리드 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {HERO_TOOLS.map((tool) => {
                const isLive = tool.status === "live";

                const cardStyle: React.CSSProperties = {
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  flexDirection: "column",
                  opacity: isLive ? 1 : 0.65,
                  cursor: isLive ? "pointer" : "default",
                  transition:
                    "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                };

                const cardContent = (
                  <>
                    {/* 아이콘 */}
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "12px",
                        background: tool.iconBg,
                        fontSize: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "18px",
                      }}
                    >
                      {tool.icon}
                    </div>

                    {/* 제목 */}
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        marginBottom: "10px",
                      }}
                    >
                      {tool.name}
                    </h3>

                    {/* 설명 */}
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

                    {/* 하단 영역: 상태 + 화살표 */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "22px",
                        paddingTop: "18px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "var(--radius-full)",
                          background: isLive
                            ? "var(--status-live-bg)"
                            : "var(--status-soon-bg)",
                          color: isLive
                            ? "var(--status-live-text)"
                            : "var(--status-soon-text)",
                        }}
                      >
                        {isLive ? "Live" : "Coming Soon"}
                      </span>

                      {isLive && (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "18px",
                          }}
                        >
                          →
                        </span>
                      )}
                    </div>
                  </>
                );

                if (isLive) {
                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      target={tool.external ? "_blank" : undefined}
                      rel={tool.external ? "noopener noreferrer" : undefined}
                      style={cardStyle}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <div key={tool.name} style={cardStyle}>
                    {cardContent}
                  </div>
                );
              })}
            </div>

            {/* 서비스 전체 보기 버튼 */}
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