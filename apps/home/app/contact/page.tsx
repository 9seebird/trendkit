"use client";

import { useEffect, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

type Notice = {
  id: string;
  tag: string;
  tagColor: string;
  tagText: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
};

const FALLBACK_NOTICES: Notice[] = [
  { id: "fallback_1", tag: "공지", tagColor: "#dcfce7", tagText: "#15803d", title: "TrendKit 서비스 정식 오픈!", content: "", date: "2026.04.21", isPublished: true },
  { id: "fallback_2", tag: "예정", tagColor: "#fef3c7", tagText: "#92400e", title: "PDF 변환기 5월 출시 예정", content: "", date: "2026.04.21", isPublished: true },
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
  const [notices, setNotices] = useState<Notice[]>(FALLBACK_NOTICES);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.notices) && data.notices.length > 0) {
          setNotices(data.notices);
        }
      })
      .catch(() => undefined);
  }, []);

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setSubmitMessage(data.message || "문의 접수 중 오류가 발생했습니다.");
      setLoading(false);
      return;
    }

    setForm({ name: "", email: "", type: "", message: "" });
    setShowSuccessModal(true);
    setLoading(false);
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>
        <section style={{
          background: "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
          padding: "clamp(40px, 7vw, 96px) 0 clamp(32px, 5vw, 76px)",
        }}>
          <div className="container-main">
            <span className="section-eyebrow">Contact</span>
            <h1 className="section-title">공지 & 문의</h1>
            <p className="section-desc">서비스 공지를 확인하거나 개선 요청을 남겨주세요</p>
          </div>
        </section>

        <section className="section-pad" style={{ background: "var(--bg-page)" }}>
          <div className="container-main">
            <div className="grid-2col" style={{ alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="card" id="notice">
                  <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>📋 공지사항</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
                    서비스 오픈 소식과 예정된 기능 업데이트를 확인하세요.
                  </p>
                  <div style={{
                    border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
                    overflow: "hidden", background: "var(--bg-page)",
                  }}>
                    {notices.map((item, i) => (
                      <div key={item.id} style={{
                        padding: "16px 18px",
                        borderBottom: i < notices.length - 1 ? "1px solid var(--border)" : "none",
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
                          {item.content ? (
                            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                              {item.content}
                            </div>
                          ) : null}
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                            {item.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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

              <form className="card" id="inquiry" onSubmit={submitInquiry}>
                <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>💬 고객 요청 사항</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
                  원하는 도구나 기능 개선 사항을 알려주세요.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "12px", marginBottom: "14px",
                }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>이름</label>
                    <input style={inputStyle} placeholder="홍길동" required
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>이메일</label>
                    <input style={inputStyle} type="email" placeholder="hello@example.com" required
                      value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>유형</label>
                  <select style={inputStyle} value={form.type} required
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
                    required
                    value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button disabled={loading} className="btn btn-dark"
                  style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.65 : 1, cursor: loading ? "wait" : "pointer" }}>
                  {loading ? "접수 중..." : "문의 접수하기"}
                </button>
                {submitMessage && (
                  <p style={{ fontSize: "13px", color: "#dc2626", marginTop: "14px", lineHeight: 1.6 }}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-success-title"
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15, 23, 42, 0.58)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "24px",
              background: "var(--bg-card, #fff)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.28)",
              padding: "32px 26px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                background: "#dcfce7",
                color: "#15803d",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              ✓
            </div>

            <h2 id="inquiry-success-title" style={{ fontSize: "22px", fontWeight: 800, marginBottom: "10px", color: "var(--text-primary)" }}>
              문의 접수 완료
            </h2>

            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "24px" }}>
              문의가 정상적으로 접수되었습니다.<br />
              빠르게 확인 후 답변드리겠습니다.
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="btn btn-dark"
              style={{ width: "100%", justifyContent: "center" }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
