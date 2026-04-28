import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import FAQAccordion from "@/app/_components/FAQAccordion";
import AdSenseAd from "@/app/_components/AdSenseAd";
import { URLS } from "@/lib/urls";

/* ============================================================
   1. 서비스 카드 데이터
   - 상단 카드 영역에서 사용
   ============================================================ */
const TOOLS = [
  {
    icon: "📊",
    iconBg: "#dbeafe",
    category: "데이터 처리",
    name: "Excel Smart Merger",
    desc: "여러 엑셀 파일을 컬럼 기준으로 정리하고 병합한 뒤 미리보기 후 다운로드할 수 있습니다.",
    href: URLS.excel,
    status: "live" as const,
    external: true,
    tags: ["Excel", "병합", "컬럼 매핑"],
  },
  {
    icon: "📄",
    iconBg: "#fef3c7",
    category: "파일 변환",
    name: "PDF 편집기",
    desc: "PDF 편집 및 변환 간단한 문서 수정과 변환 기능",
    href: URLS.pdf,
    status: "live" as const,
    external: true,
    tags: ["PDF", "변환", "Word"],
  },
  {
    icon: "☁️",
    iconBg: "#dbeafe",
    category: "뉴스 분석",
    name: "워드클라우드 생성기",
    desc: "검색어를 입력하면 관련 뉴스를 수집해 자주 등장한 단어를 워드클라우드로 시각화합니다.",
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
    desc: "오늘 뉴스에서 자주 언급된 키워드를 정리하고 시각화하여 빠르게 흐름을 파악할 수 있습니다.",
    href: URLS.trends,
    status: "live" as const,
    external: true,
    tags: ["트렌드", "키워드", "뉴스 분석"],
  },
];

/* ============================================================
   2. FAQ 데이터
   - FAQAccordion 컴포넌트에 전달
   ============================================================ */
const SERVICE_FAQ = [
  {
    question: "엑셀 병합 도구는 어떤 상황에서 유용한가요?",
    answer:
      "여러 개의 엑셀 파일을 하나로 합쳐야 할 때 유용합니다.\n예를 들어 날짜별 보고서, 지점별 매출 파일, 여러 담당자가 나눠 작성한 목록을 한 번에 정리할 수 있습니다.",
  },
  {
    question: "같은 형식이 아닌 파일도 병합할 수 있나요?",
    answer:
      "기본적으로는 비슷한 컬럼 구조를 가진 파일끼리 병합할 때 가장 효율적입니다.\n다만 컬럼명을 확인하고 맞춘 뒤 병합하면 형식이 조금 다른 파일도 정리할 수 있습니다.",
  },
  {
    question: "PDF 편집기는 어떤 기능을 제공하나요?",
    answer:
      "PDF 파일의 텍스트 수정, 페이지 추가/삭제, 순서 변경 등 다양한 편집 기능을 제공합니다. 문서 수정이나 간단한 재가공 작업에 유용합니다.",
  },
  {
    question: "PDF 파일을 다른 형식으로 변환할 수 있나요?",
    answer:
      "네, PDF를 이미지나 텍스트 형태로 변환하거나 반대로 파일을 PDF로 저장할 수 있습니다. 문서 공유나 제출용 파일 준비에 편리합니다.",
  },
  {
    question: "워드클라우드 생성기는 어떤 도구인가요?",
    answer:
      "텍스트 안에서 자주 등장한 단어를 시각적으로 크게 보여주는 도구입니다.\n뉴스나 문서의 핵심 키워드를 빠르게 파악할 때 유용합니다.",
  },
  {
    question: "워드클라우드는 어떤 데이터로 만들 수 있나요?",
    answer:
      "검색어 기반 뉴스 데이터나 일반 텍스트 데이터에 활용할 수 있습니다.\n반복적으로 등장하는 단어를 시각화해 주요 주제를 확인할 수 있습니다.",
  },
  {
    question: "키워드 트렌드 도구는 무엇을 보여주나요?",
    answer:
      "뉴스 등 수집된 데이터에서 자주 등장하는 키워드를 정리해 보여줍니다.\n어떤 단어가 많이 언급되고 있는지 빠르게 확인할 수 있습니다.",
  },
  {
    question: "검색 상위 키워드는 어떤 방식으로 확인하나요?",
    answer:
      "수집된 데이터 안에서 빈도가 높은 단어를 기준으로 정리하여 보여줍니다.\n차트나 태그 형태로 시각화되어 흐름을 직관적으로 파악할 수 있습니다.",
  },
  {
    question: "프로그램을 설치해야 하나요?",
    answer:
      "아니요. TrendKit의 서비스는 브라우저에서 바로 사용할 수 있는 웹 기반 도구이기 때문에 별도의 설치 없이 이용할 수 있습니다.",
  },
  {
    question: "결과를 바로 다운로드하거나 활용할 수 있나요?",
    answer:
      "도구에 따라 병합 결과 다운로드, 이미지 저장, CSV 다운로드 등 실무에 바로 활용할 수 있는 출력 기능을 제공합니다.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main style={{ paddingTop: "var(--nav-height)" }}>
        {/* 상단 히어로 */}
        <section
          style={{
            background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
            padding: "clamp(40px, 7vw, 96px) 0 clamp(32px, 5vw, 72px)",
            textAlign: "center",
          }}
        >
          <div className="container-main" style={{ textAlign: "center" }}>
            <span className="section-eyebrow">All Tools</span>
            <h1 className="section-title">생산성 도구 모음</h1>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              복잡한 설치 없이 브라우저에서 바로 사용하는
              <br />
              웹 기반 도구들
            </p>
          </div>
        </section>

        <div className="container-main services-top-ad">
          <AdSenseAd label="서비스 상단 광고" />
        </div>

        {/* 서비스 카드 목록 */}
        <section className="section-pad" style={{ background: "var(--bg-page)" }}>
          <div className="container-main">
            <div className="grid-cards">
              {TOOLS.map((tool) => {
                const isLive = tool.status === "live";

                return (
                  <div
                    key={tool.name}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      opacity: isLive ? 1 : 0.72,
                    }}
                  >
                    {/* 카드 상단 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        className="badge"
                        style={{
                          background: "var(--brand-light)",
                          color: "var(--brand)",
                        }}
                      >
                        {tool.category}
                      </span>

                      <span
                        className="badge"
                        style={{
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
                    <div className="icon-box" style={{ background: tool.iconBg }}>
                      {tool.icon}
                    </div>

                    {/* 제목 */}
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "8px",
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
                        whiteSpace: "pre-line",
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
                        marginTop: "14px",
                      }}
                    >
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
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

                    {/* 버튼 */}
                    <div
                      style={{
                        marginTop: "18px",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      {isLive ? (
                        <Link
                          href={tool.href}
                          target={tool.external ? "_blank" : undefined}
                          rel={tool.external ? "noopener noreferrer" : undefined}
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

            <div className="services-card-bottom-ad">
              <AdSenseAd label="서비스 카드 하단 광고" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQAccordion title="자주 묻는 질문(FAQ)" items={SERVICE_FAQ} />

        <div className="container-main services-faq-bottom-ad">
          <AdSenseAd label="FAQ 하단 광고" />
        </div>
      </main>

      <Footer />
    </>
  );
}