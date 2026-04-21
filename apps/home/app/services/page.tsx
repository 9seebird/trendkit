// ─────────────────────────────────────────────────────
// SERVICES 페이지
// 도구 추가 시 TOOLS 배열에 항목만 추가하세요.
//
// external: true  → 새 탭 (외부 서비스)
// external: false → 내부 페이지 이동 (뒤로가기 지원)
// status: 'live'  → 바로 사용 가능
// status: 'soon'  → 출시 예정 (버튼 비활성)
// ─────────────────────────────────────────────────────
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import BackButton from "../_components/BackButton";
import { URLS } from "@/lib/urls";

const TOOLS = [
  {
    icon: "📊",
    iconBg: "#dbeafe",
    category: "데이터 처리",
    name: "Excel Smart Merger",
    desc: "여러 엑셀 파일을 컬럼 기반으로 스마트하게 병합합니다. 각 파일의 컬럼을 자유롭게 매핑하고 미리보기 후 다운로드.",
    href: URLS.excel,
    status: "live" as const,
    external: true,           // 외부 서비스 → 새 탭
    tags: ["Excel", "병합", "컬럼 매핑"],
  },
  {
    icon: "☁️",
    iconBg: "#dbeafe",
    category: "뉴스 분석",
    name: "워드클라우드 생성기",
    desc: "검색어를 입력하면 관련 뉴스를 수집해 워드클라우드를 만듭니다. 빈도 CSV와 이미지 다운로드 지원.",
    href: URLS.wordcloud,
    status: "live" as const,
    external: true,
    tags: ["워드클라우드", "뉴스", "키워드"],
  },
  {
    icon: "📈",
    iconBg: "#dcfce7",
    category: "뉴스 분석",
    name: "키워드 트렌드",
    desc: "오늘 뉴스에서 가장 많이 언급된 키워드를 바 차트와 태그 클라우드로 보여줍니다.",
    href: URLS.trends,
    status: "live" as const,
    external: true,
    tags: ["트렌드", "키워드", "뉴스 분석"],
  },
  {
    icon: "📄",
    iconBg: "#fef3c7",
    category: "파일 변환",
    name: "PDF 변환기",
    desc: "Word, Excel, 이미지 파일을 PDF로 빠르게 변환합니다. 드래그 앤 드롭으로 간단하게 사용하세요.",
    href: "#",
    status: "soon" as const,
    external: false,
    tags: ["PDF", "변환", "Word"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>

        {/* ── 페이지 헤더 ── */}
        <section
          style={{
            background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
            padding: "96px 48px 72px",
            textAlign: "center",
          }}
        >
          <div className="container-main" style={{ textAlign: "left" }}>
            {/* 뒤로가기: 이전 페이지(보통 홈)으로 이동 */}

          </div>
          <div className="container-main" style={{ textAlign: "center" }}>
            <span className="section-eyebrow">All Tools</span>
            <h1 className="section-title">생산성 도구 모음</h1>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              복잡한 설치 없이 브라우저에서 바로 사용하는 웹 기반 도구들
            </p>
          </div>
        </section>

        {/* ── 도구 그리드 ── */}
        <section className="section-pad" style={{background: "var(--bg-page)" }}>
          <div className="container-main">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {TOOLS.map((tool) => {
                const isLive = tool.status === "live";

                return (
                  <div
                    key={tool.name}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      opacity: isLive ? 1 : 0.7,
                    }}
                  >
                    {/* 카테고리 + 상태 뱃지 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "18px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "var(--brand)",
                          background: "var(--brand-light)",
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        {tool.category}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          background: isLive
                            ? "var(--status-live-bg)"
                            : "var(--status-soon-bg)",
                          color: isLive
                            ? "var(--status-live-text)"
                            : "var(--status-soon-text)",
                        }}
                      >
                        {isLive ? "● Live" : "Coming Soon"}
                      </span>
                    </div>

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
                        marginBottom: "16px",
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

                    {/* 태그 */}
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginTop: "16px",
                      }}
                    >
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            background: "var(--bg-page)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA 버튼 */}
                    <div
                      style={{
                        marginTop: "20px",
                        paddingTop: "18px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {isLive ? (
                        <Link
                          href={tool.href}
                          // external: true → 새 탭 / false → 같은 탭 (뒤로가기 지원)
                          target={tool.external ? "_blank" : undefined}
                          rel={
                            tool.external ? "noopener noreferrer" : undefined
                          }
                          className="btn btn-dark"
                          style={{ width: "100%", justifyContent: "center" }}
                        >
                          바로 사용하기 →
                        </Link>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "10px",
                            fontSize: "14px",
                            color: "var(--text-muted)",
                          }}
                        >
                          출시 예정
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
