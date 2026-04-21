import Header from "../_components/Header";
import Footer from "../_components/Footer";
import BackButton from "../_components/BackButton";

/* ================================================================
   ABOUT 페이지 — 이 파일에서 직접 내용을 편집하세요.
   각 섹션에 주석으로 편집 위치를 표시해두었습니다.
   ================================================================ */

// ── 회사 소개 내용 편집 ──
const ABOUT_CONTENT = {
  headline: "반복 업무를 없애는\n도구를 만듭니다",
  subheadline: "About TrendKit",
  intro: `실무에서 매일 마주치는 비효율적인 반복 작업을 없애기 위해 시작되었습니다.
TrendKit을 통해 시간을 절약하세요.`,
  mission: `무거운 소프트웨어를 설치하거나 복잡한 설정 없이, 브라우저만 있으면 바로 사용할 수 있는
웹 기반 도구들을 계속해서 만들어 나가겠습니다.`,
};

// ── 비전 섹션 편집 ──
const VISION_ITEMS = [
  {
    icon: "🎯",
    title: "실용적인 도구",
    desc: "현장에서 실제로 필요한 기능만. 화려한 기능보다 바로 쓸 수 있는 도구를 만듭니다.",
  },
  {
    icon: "⚡",
    title: "빠른 실행",
    desc: "설치 없이, 로그인 없이. 링크 하나로 접속해서 바로 사용하세요.",
  },
  {
    icon: "🔒",
    title: "데이터 보안",
    desc: "업로드한 파일은 서버에 저장되지 않습니다. 모든 처리는 브라우저에서.",
  },
];

// ── 팀 소개 편집 ──
const TEAM = [
  {
    name: "trendkit", // 이름
    role: "Founder & Planner", // 역할
    bio: "6년간 웹 기획, 운영, 분석 업무를 하며 쌓인 반복 작업의 불편함을 해소하기 위해 사이트를 제작했습니다.",
  },
  // 팀원 추가 시 여기에 객체 추가
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>
        {/* ── 인트로 히어로 ── */}
        <section
          style={{
            background:
              "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
            padding: "96px 48px 80px",
          }}
        >
          <div className="container-main" style={{ marginBottom: "24px" }}>

          </div>
          <div className="container-main">
            <span className="section-eyebrow">{ABOUT_CONTENT.subheadline}</span>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "clamp(36px, 5vw, 54px)",
                lineHeight: 1.1,
                letterSpacing: "-1px",
                color: "var(--text-primary)",
                marginBottom: "28px",
                whiteSpace: "pre-line",
              }}
            >
              {ABOUT_CONTENT.headline}
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
                maxWidth: "560px",
                whiteSpace: "pre-line",
              }}
            >
              {ABOUT_CONTENT.intro}
            </p>
          </div>
        </section>

        {/* ── 미션 ── */}
        <section
          className="section-pad"
          style={{ background: "var(--bg-surface)" }}
        >
          <div
            className="container-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
            }}
          >
            <div>
              <span className="section-eyebrow">Our Mission</span>
              <h2 className="section-title">왜 TrendKit 인가요?</h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {ABOUT_CONTENT.mission}
              </p>
            </div>
            {/* 통계 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {[
                { num: "1+", label: "출시된 도구" },
                { num: "0원", label: "사용 비용" },
                { num: "∞", label: "처리 파일 수" },
                { num: "24/7", label: "언제나 사용 가능" },
              ].map(({ num, label }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--bg-page)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "28px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "36px",
                      color: "var(--text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginTop: "8px",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 비전 ── */}
        <section
          id="vision"
          className="section-pad"
          style={{ background: "var(--bg-page)" }}
        >
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <span className="section-eyebrow">Vision</span>
              <h2 className="section-title">우리가 추구하는 것</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {VISION_ITEMS.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "32px",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      marginBottom: "10px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 팀 ── */}
        {TEAM.length > 0 && (
          <section
            id="team"
            className="section-pad"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="container-main">
              <div style={{ textAlign: "center", marginBottom: "52px" }}>
                <span className="section-eyebrow">Team</span>
                <h2 className="section-title">만드는 사람들</h2>
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {TEAM.map((member) => (
                  <div
                    key={member.name}
                    style={{
                      background: "var(--bg-page)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "28px",
                      minWidth: "240px",
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: "var(--radius-full)",
                        background: "var(--brand-light)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        marginBottom: "16px",
                      }}
                    >
                      👤
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 700 }}>
                      {member.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--brand)",
                        marginBottom: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {member.role}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                      }}
                    >
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
