// about/page.tsx — card/badge 클래스 활용, 인라인 스타일 최소화
import Header from "../_components/Header";
import Footer from "../_components/Footer";

const ABOUT_CONTENT = {
  headline: "반복 업무를 없애는\n도구를 만듭니다",
  subheadline: "About TrendKit",
  intro: "실무에서 매일 마주치는 비효율적인 반복 작업을 없애기 위해 시작되었습니다.\nTrendKit을 통해 시간을 절약하세요.",
  mission: "무거운 소프트웨어를 설치하거나 복잡한 설정 없이, 브라우저만 있으면 바로 사용할 수 있는\n웹 기반 도구들을 계속해서 만들어 나가겠습니다.",
};

const VISION_ITEMS = [
  { icon: "🎯", title: "실용적인 도구", desc: "현장에서 실제로 필요한 기능만. 화려한 기능보다 바로 쓸 수 있는 도구를 만듭니다." },
  { icon: "⚡", title: "빠른 실행",     desc: "설치 없이, 로그인 없이. 링크 하나로 접속해서 바로 사용하세요." },
  { icon: "🔒", title: "데이터 보안",   desc: "업로드한 파일은 서버에 저장되지 않습니다. 모든 처리는 브라우저에서." },
];

const STATS = [
  { num: "3+",   label: "출시된 도구" },
  { num: "0원",  label: "사용 비용" },
  { num: "∞",   label: "처리 파일 수" },
  { num: "24/7", label: "언제나 사용" },
];

const TEAM = [
  { name: "trendkit", role: "Founder & Planner", bio: "6년간 웹 기획, 운영, 분석 업무를 하며 쌓인 반복 작업의 불편함을 해소하기 위해 사이트를 제작했습니다." },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>

        {/* ── 히어로 ── */}
        <section style={{
          background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
          padding: "clamp(40px, 7vw, 96px) 0 clamp(36px, 5vw, 80px)",
        }}>
          <div className="container-main">
            <div style={{ marginBottom: "20px" }}>
            </div>
            <span className="section-eyebrow">{ABOUT_CONTENT.subheadline}</span>
            <h1 style={{
              fontWeight: 700,
              fontSize: "clamp(30px, 5vw, 54px)",
              lineHeight: 1.1, letterSpacing: "-1px",
              color: "var(--text-primary)",
              marginBottom: "20px", whiteSpace: "pre-line",
            }}>{ABOUT_CONTENT.headline}</h1>
            <p style={{
              fontSize: "clamp(15px, 2vw, 17px)",
              color: "var(--text-secondary)", lineHeight: 1.8,
              maxWidth: "560px", whiteSpace: "pre-line",
            }}>{ABOUT_CONTENT.intro}</p>
          </div>
        </section>

        {/* ── 미션 ── */}
        <section className="section-pad" style={{ background: "var(--bg-surface)" }}>
          <div className="container-main">
            <div className="grid-2col">
              <div>
                <span className="section-eyebrow">Our Mission</span>
                <h2 className="section-title">왜 TrendKit 인가요?</h2>
                <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {ABOUT_CONTENT.mission}
                </p>
              </div>

              {/* 통계: 항상 2×2 유지 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {STATS.map(({ num, label }) => (
                  <div key={label} className="card card-page">
                    <div style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                      {num}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 비전 ── */}
        <section id="vision" className="section-pad" style={{ background: "var(--bg-page)" }}>
          <div className="container-main">
            <div style={{ textAlign: "center", marginBottom: "clamp(28px, 5vw, 52px)" }}>
              <span className="section-eyebrow">Vision</span>
              <h2 className="section-title">우리가 추구하는 것</h2>
            </div>
            <div className="grid-3col">
              {VISION_ITEMS.map((item) => (
                <div key={item.title} className="card">
                  <div style={{ fontSize: "30px", marginBottom: "14px" }}>{item.icon}</div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 팀 ── */}
        {TEAM.length > 0 && (
          <section id="team" className="section-pad" style={{ background: "var(--bg-surface)" }}>
            <div className="container-main">
              <div style={{ textAlign: "center", marginBottom: "clamp(28px, 5vw, 52px)" }}>
                <span className="section-eyebrow">Team</span>
                <h2 className="section-title">만드는 사람들</h2>
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {TEAM.map((member) => (
                  <div key={member.name} className="card card-page" style={{ flex: "1 1 240px", minWidth: 0 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: "50%",
                      background: "var(--brand-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "22px", marginBottom: "14px",
                    }}>👤</div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700 }}>{member.name}</h3>
                    <p style={{ fontSize: "13px", color: "var(--brand)", marginBottom: "10px", fontWeight: 600 }}>{member.role}</p>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}>{member.bio}</p>
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
