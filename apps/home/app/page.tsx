// ─────────────────────────────────────────────────────
// 홈페이지 (/)
// 구성: Hero 섹션 + 서비스 미리보기 섹션
//
// 도구 카드 수정: 아래 HERO_TOOLS 배열을 편집하세요.
// 히어로 문구 수정: 코드 내 주석 위치를 찾아 편집하세요.
// ─────────────────────────────────────────────────────
import Link from "next/link";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { URLS } from "@/lib/urls";

// ── 히어로 우측에 표시되는 도구 미리보기 카드 데이터 ──
// services/page.tsx 의 TOOLS 와 별개로 관리됩니다.
// 홈에 노출할 도구만 여기에 넣으세요.
const HERO_TOOLS = [
  {
    icon: "📊",
    iconBg: "#dbeafe",
    name: "Excel Smart Merger",
    desc: "여러 엑셀 파일을 컬럼 기반으로 스마트하게 병합. 컬럼 매핑, 미리보기, 다운로드까지.",
    href: URLS.excel,
    status: "live" as const,
    external: true, // 외부 서비스: 새 탭으로 이동
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
        {/* ══════════════════════════════════════
            HERO 섹션
            ─ 문구 수정: 아래 h1, p 태그 안 텍스트 편집
            ─ 배경 그라디언트: section style 의 background 편집
            ══════════════════════════════════════ */}
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
          {/* 배경 글로우 효과 (장식용) */}
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
            {/* ── 왼쪽: 히어로 텍스트 + CTA ── */}
            <div>
              {/* ── 상단 레이블 편집 ── */}
              <span className="section-eyebrow">Productivity Tools</span>

              {/* ── 메인 헤드라인 편집 ── */}
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
                <em style={{ fontStyle: "italic", color: "var(--brand)" }}>
                  더 스마트하게
                </em>
                <br />
                일하세요
              </h1>

              {/* ── 서브 설명문 편집 ── */}
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

              {/* CTA 버튼 그룹 */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {/* 서비스 페이지로 내부 이동 (뒤로가기 지원) */}
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
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {HERO_TOOLS.map((tool, i) => (
                <div
                  key={tool.name}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxShadow: "var(--shadow-sm)",
                    // 카드를 살짝 엇갈리게 배치해 깊이감 연출
                    marginLeft: i === 1 ? "28px" : i === 2 ? "14px" : "0",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                >
                  {/* 아이콘 */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "10px",
                      background: tool.iconBg,
                      fontSize: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {tool.icon}
                  </div>

                  {/* 이름 + 짧은 설명 */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {tool.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {tool.desc.slice(0, 32)}…
                    </div>
                  </div>

                  {/* 상태 뱃지 */}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background:
                        tool.status === "live"
                          ? "var(--status-live-bg)"
                          : "var(--status-soon-bg)",
                      color:
                        tool.status === "live"
                          ? "var(--status-live-text)"
                          : "var(--status-soon-text)",
                    }}
                  >
                    {tool.status === "live" ? "Live" : "Soon"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            서비스 미리보기 섹션
            ─ 카드 클릭 시 /services 로 이동하도록
              "모든 서비스 보기" 버튼 연결
            ══════════════════════════════════════ */}
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

            {/* 도구 카드 그리드 */}
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

                    {/* 이름 + 설명 */}
                    <h3
                      style={{
                        fontSize: "17px",
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

                    {/* 하단: 상태 뱃지 + 화살표 */}
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

            {/* 서비스 페이지 이동 버튼 (내부 라우팅 → 뒤로가기 지원) */}
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
