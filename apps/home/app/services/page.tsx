// services/page.tsx — card/badge 클래스 활용
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { URLS } from "@/lib/urls";

const TOOLS = [
  {
    icon: "📊", iconBg: "#dbeafe", category: "데이터 처리",
    name: "Excel Smart Merger",
    desc: "여러 엑셀 파일을 컬럼 기반으로 스마트하게 병합합니다. 컬럼을 자유롭게 매핑하고 미리보기 후 다운로드.",
    href: URLS.excel, status: "live" as const, external: true,
    tags: ["Excel", "병합", "컬럼 매핑"],
  },
  {
    icon: "☁️", iconBg: "#dbeafe", category: "뉴스 분석",
    name: "워드클라우드 생성기",
    desc: "검색어를 입력하면 관련 뉴스를 수집해 워드클라우드를 만듭니다. 빈도 CSV와 이미지 다운로드 지원.",
    href: URLS.wordcloud, status: "live" as const, external: true,
    tags: ["워드클라우드", "뉴스", "키워드"],
  },
  {
    icon: "📈", iconBg: "#dcfce7", category: "뉴스 분석",
    name: "키워드 트렌드",
    desc: "오늘 뉴스에서 가장 많이 언급된 키워드를 바 차트와 태그 클라우드로 보여줍니다.",
    href: URLS.trends, status: "live" as const, external: true,
    tags: ["트렌드", "키워드", "뉴스 분석"],
  },
  {
    icon: "📄", iconBg: "#fef3c7", category: "파일 변환",
    name: "PDF 변환기",
    desc: "Word, Excel, 이미지 파일을 PDF로 빠르게 변환합니다. 드래그 앤 드롭으로 간단하게 사용하세요.",
    href: "#", status: "soon" as const, external: false,
    tags: ["PDF", "변환", "Word"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>

        <section style={{
          background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
          padding: "clamp(40px, 7vw, 96px) 0 clamp(32px, 5vw, 72px)",
          textAlign: "center",
        }}>
          <div className="container-main" style={{ textAlign: "left", marginBottom: "16px" }}>
          </div>
          <div className="container-main" style={{ textAlign: "center" }}>
            <span className="section-eyebrow">All Tools</span>
            <h1 className="section-title">생산성 도구 모음</h1>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              복잡한 설치 없이 브라우저에서 바로 사용하는 웹 기반 도구들
            </p>
          </div>
        </section>

        <section className="section-pad" style={{ background: "var(--bg-page)" }}>
          <div className="container-main">
            <div className="grid-cards">
              {TOOLS.map((tool) => {
                const isLive = tool.status === "live";
                return (
                  <div key={tool.name} className="card" style={{
                    display: "flex", flexDirection: "column",
                    opacity: isLive ? 1 : 0.7,
                  }}>
                    {/* 카테고리 + 상태 */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span className="badge" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                        {tool.category}
                      </span>
                      <span className="badge" style={{
                        background: isLive ? "var(--status-live-bg)" : "var(--status-soon-bg)",
                        color: isLive ? "var(--status-live-text)" : "var(--status-soon-text)",
                      }}>{isLive ? "● Live" : "Coming Soon"}</span>
                    </div>

                    <div className="icon-box" style={{ background: tool.iconBg }}>{tool.icon}</div>

                    <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{tool.name}</h3>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65, flex: 1 }}>{tool.desc}</p>

                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "14px" }}>
                      {tool.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: "11px", padding: "3px 8px",
                          background: "var(--bg-page)", border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)", color: "var(--text-muted)",
                        }}>{tag}</span>
                      ))}
                    </div>

                    <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                      {isLive ? (
                        <Link href={tool.href}
                          target={tool.external ? "_blank" : undefined}
                          rel={tool.external ? "noopener noreferrer" : undefined}
                          className="btn btn-dark"
                          style={{ width: "100%", justifyContent: "center" }}>
                          바로 사용하기 →
                        </Link>
                      ) : (
                        <div style={{ textAlign: "center", padding: "10px", fontSize: "14px", color: "var(--text-muted)" }}>
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
