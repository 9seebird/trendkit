"use client";
import { useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import BackButton from "../_components/BackButton";

// ─────────────────────────────────────────────────────
// CONTACT 페이지
// 구성: 공지사항 + 고객 요청 사항
// 현재 문의 폼은 UI만 구현되어 있으며,
// 실제 전송 기능은 아직 연결하지 않은 상태입니다.
// ─────────────────────────────────────────────────────

// ── 공지사항 데이터 ──
const NOTICES = [
  {
    id: 1,
    tag: "공지",
    tagColor: "#dcfce7",
    tagText: "#15803d",
    title: "TrendKit 서비스 정식 오픈!",
    date: "2026.04.21",
  },
  {
    id: 2,
    tag: "예정",
    tagColor: "#fef3c7",
    tagText: "#92400e",
    title: "PDF 변환기 5월 출시 예정",
    date: "2026.04.21",
  },
];

// ── 회사 정보 ──
const COMPANY_INFO = {
  address: "서울특별시",
  email: "contact@trendkit.app",
  hours: "원격 운영 · 24/7",
};

// ── 인풋 공통 스타일 ──
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  background: "var(--bg-page)",
  color: "var(--text-primary)",
  outline: "none",
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "32px",
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  return (
    <>
      <Header />
      <main style={{ paddingTop: "var(--nav-height)" }}>
        {/* ── 페이지 헤더 ── */}
        <section
          style={{
            background:
              "linear-gradient(155deg, #e8f0fe 0%, var(--bg-page) 60%)",
            padding: "46px 48px 76px",
          }}
        >
          <div className="container-main" style={{ marginBottom: "34px" }}>

          </div>

          <div className="container-main">
            <span className="section-eyebrow">Contact</span>
            <h1 className="section-title">공지 & 문의</h1>
            <p className="section-desc">
              서비스 공지를 확인하거나 개선 요청을 남겨주세요
            </p>
          </div>
        </section>

        {/* ── 본문 ── */}
        <section
          className="section-pad"
          style={{ background: "var(--bg-page)" }}
        >
          <div
            className="container-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              alignItems: "start",
            }}
          >
            {/* ── 왼쪽: 공지사항 영역 ── */}
            <div style={{ display: "grid", gap: "16px" }}>
              {/* 공지사항 카드 */}
              <div style={cardStyle}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  📋 공지사항
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    marginBottom: "34px",
                  }}
                >
                  서비스 오픈 소식과 예정된 기능 업데이트를 확인할 수 있습니다.
                </p>

                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "var(--bg-page)",
                  }}
                >
                  {NOTICES.map((item, i) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "20px 24px",
                        borderBottom:
                          i < NOTICES.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "999px",
                          flexShrink: 0,
                          marginTop: "2px",
                          background: item.tagColor,
                          color: item.tagText,
                        }}
                      >
                        {item.tag}
                      </span>

                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--text-muted)",
                            marginTop: "16px",
                          }}
                        >
                          {item.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 회사 정보 카드 */}
              <div style={cardStyle}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "20px",
                  }}
                >
                  📍 운영 정보
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 20px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--bg-page)",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📍</span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600 }}>
                      {COMPANY_INFO.address}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      {COMPANY_INFO.email} · {COMPANY_INFO.hours}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 오른쪽: 고객 요청 폼 ── */}
            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                💬 고객 요청 사항
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                원하는 도구나 기능 개선 사항을 알려주세요.
              </p>

              {/* 이름 + 이메일 */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "14px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    이름
                  </label>
                  <input
                    style={inputStyle}
                    placeholder="홍길동"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "6px",
                    }}
                  >
                    이메일
                  </label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="hello@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 유형 */}
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  유형
                </label>
                <select
                  style={inputStyle}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">선택해주세요</option>
                  <option>기능 요청</option>
                  <option>버그 신고</option>
                  <option>새 도구 제안</option>
                  <option>기타 문의</option>
                </select>
              </div>

              {/* 내용 */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  내용
                </label>
                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: "120px",
                    resize: "vertical",
                  }}
                  placeholder="요청 내용을 자세히 작성해주세요..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
              </div>

              {/* 일단 비활성화 */}
              <button
                disabled
                className="btn btn-dark"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  opacity: 0.55,
                  cursor: "not-allowed",
                }}
              >
                문의 기능 준비 중
              </button>

              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "52px",
                  lineHeight: 1.6,
                }}
              >
                현재 문의 접수 기능은 준비 중입니다.
                <br />
                급한 문의는 {COMPANY_INFO.email} 로 보내주세요.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}