import Link from "next/link";
import { URLS } from "@/lib/urls";

// ─────────────────────────────────────────────────────
// Footer 컴포넌트
// 링크 추가·수정: FOOTER_LINKS 객체를 편집하세요.
// 회사 정보 수정: COPYRIGHT 상수를 편집하세요.
// ─────────────────────────────────────────────────────

// ── 푸터 링크 데이터 ──
// external: true → 새 탭, 없으면 내부 라우팅
const FOOTER_LINKS: Record<
  string,
  { label: string; href: string; external?: boolean }[]
> = {
  서비스: [
    { label: "Excel Merger",    href: URLS.excel,     external: true },
    { label: "워드클라우드",    href: URLS.wordcloud,  external: true },
    { label: "키워드 트렌드",   href: URLS.trends,    external: true },
  ],
  회사: [
    { label: "소개",  href: "/about"        },
    { label: "비전",  href: "/about#vision" },
  ],
  고객지원: [
    { label: "공지사항",  href: "/contact#notice"   },
    { label: "문의하기",  href: "/contact#inquiry"  },
  ],
};

// ── 저작권 / 회사 정보 ──
const COPYRIGHT = {
  year:  2026,
  name:  "TrendKit",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111",
        color: "#6b7280",
        padding: "64px 48px 32px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* 상단: 브랜드 + 링크 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* 브랜드 소개 */}
          <div>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "22px",
                color: "#fff",
                display: "block",
                marginBottom: "16px",
              }}
            >
              TrendKit
            </span>
            {/* ── 푸터 소개 문구 편집 ── */}
            <p style={{ fontSize: "14px", lineHeight: 1.75, maxWidth: "260px" }}>
              설치 없이 브라우저에서 바로 사용하는<br />
              업무 자동화 도구 모음.
            </p>
          </div>

          {/* 링크 컬럼 */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#fff",
                  marginBottom: "16px",
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: "10px" }}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단: 저작권 */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "13px" }}>
            © {COPYRIGHT.year} {COPYRIGHT.name}. All rights reserved.
          </p>
          <p style={{ fontSize: "13px" }}>{COPYRIGHT.email}</p>
        </div>
      </div>
    </footer>
  );
}
