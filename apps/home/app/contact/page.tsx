"use client";
import { useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

const NOTICES = [
  { id: 1, tag: "공지", tagColor: "#dcfce7", tagText: "#15803d", title: "TrendKit 서비스 정식 오픈!", date: "2026.04.21" },
  { id: 2, tag: "예정", tagColor: "#fef3c7", tagText: "#92400e", title: "PDF 변환기 5월 출시 예정",  date: "2026.04.21" },
];

const COMPANY_INFO = {
  address: "서울특별시",
  email: "contact@trendkit.app",
  hours: "원격 운영 · 24/7",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-sans), sans-serif",
  fontSize: "14px",
  background: "var(--bg-page)",
  color: "var(--text-primary)",
  outline: "none",
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });

  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>

        {/* ── 헤더 ── */}
        <section style={{
          background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
          padding: "clamp(40px, 7vw, 96px) 0 clamp(32px, 5vw, 76px)",
        }}>
          <div className="container-main">
            <div style={{ marginBottom: "20px" }}>
            </div>
            <span className="section-eyebrow">Contact</span>
            <h1 className="section-title">공지 & 문의</h1>
            <p className="section-desc">서비스 공지를 확인하거나 개선 요청을 남겨주세요</p>
          </div>
        </section>

        {/* ── 본문 ── */}
        <section className="section-pad" style={{ background: "var(--bg-page)" }}>
          <div className="container-main">
            {/* 데스크탑 2컬럼 / 모바일 1컬럼 */}
            <div className="grid-2col" style={{ alignItems: "start" }}>

              {/* 왼쪽 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* 공지사항 */}
                <div className="card">
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>📋 공지사항</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    서비스 오픈 소식과 예정된 기능 업데이트를 확인하세요.
                  </p>
                  <div style={{
                    border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    overflow: "hidden", background: "var(--bg-page)",
                  }}>
                    {NOTICES.map((item, i) => (
                      <div key={item.id} style={{
                        padding: "16px 18px",
                        borderBottom: i < NOTICES.length - 1 ? "1px solid var(--border)" : "none",
                        display: "flex", alignItems: "flex-start", gap: "10px",
                      }}>
                        <span className="badge" style={{
                          background: item.tagColor, color: item.tagText,
                          flexShrink: 0, marginTop: "2px",
                        }}>{item.tag}</span>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                            {item.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 운영 정보 */}
                <div className="card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 24px" }}>
                  <span style={{ fontSize: "26px", flexShrink: 0 }}>📍</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{COMPANY_INFO.address}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                      {COMPANY_INFO.email} · {COMPANY_INFO.hours}
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 문의 폼 */}
              <div className="card">
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>💬 고객 요청 사항</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                  원하는 도구나 기능 개선 사항을 알려주세요.
                </p>

                {/* 이름 + 이메일: auto-fit으로 모바일 자동 1열 */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px", marginBottom: "14px",
                }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>이름</label>
                    <input style={inputStyle} placeholder="홍길동"
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>이메일</label>
                    <input style={inputStyle} type="email" placeholder="hello@example.com"
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>유형</label>
                  <select style={inputStyle} value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="">선택해주세요</option>
                    <option>기능 요청</option>
                    <option>버그 신고</option>
                    <option>새 도구 제안</option>
                    <option>기타 문의</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>내용</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                    placeholder="요청 내용을 자세히 작성해주세요..."
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button disabled className="btn btn-dark"
                  style={{ width: "100%", justifyContent: "center", opacity: 0.55, cursor: "not-allowed" }}>
                  문의 기능 준비 중
                </button>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "14px", lineHeight: 1.6 }}>
                  급한 문의는 {COMPANY_INFO.email} 로 보내주세요.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
