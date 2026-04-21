import Link from "next/link";
import { URLS } from "@/lib/urls";

/* =========================
   링크 데이터
   ========================= */
const FOOTER_LINKS: Record<string, { label: string; href: string; external?: boolean }[]> = {
  회사: [
    { label: "소개", href: "/about" },
    { label: "비전", href: "/about#vision" },
  ],
  서비스: [
    { label: "Excel Merger", href: URLS.excel, external: true },
    { label: "워드클라우드", href: URLS.wordcloud, external: true },
    { label: "키워드 트렌드", href: URLS.trends, external: true },
  ],
  고객지원: [
    { label: "공지사항", href: "/contact#notice" },
    { label: "문의하기", href: "/contact#inquiry" },
  ],
  정책: [
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
  ],
};

/* =========================
   순서 강제 (중요)
   ========================= */
const FOOTER_ORDER = ["회사", "서비스", "고객지원", "정책"];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111",
        color: "#6b7280",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 0 24px",
      }}
    >
      {/* 컨테이너 (메인과 정렬 맞춤) */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* =========================
            상단 영역
        ========================= */}
        <div className="footer-top">
          {/* 브랜드 */}
          <div className="footer-brand">
            <span className="footer-brand-title">TrendKit</span>
            <p className="footer-brand-desc">
              설치 없이 브라우저에서 바로 사용하는
              <br />
              업무 자동화 도구 모음.
            </p>
          </div>

          {/* 링크 */}
          <div className="footer-links-grid">
            {FOOTER_ORDER.map((category) => (
              <div key={category} className="footer-col">
                <h4 className="footer-title">{category}</h4>

                <ul className="footer-list">
                  {FOOTER_LINKS[category].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="footer-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            저작권
        ========================= */}
        <div className="footer-copy">
          © 2026 TrendKit. All rights reserved.
        </div>
      </div>

      {/* =========================
          스타일
      ========================= */}
      <style>{`
        /* ===== 전체 구조 ===== */
        .footer-top {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-bottom: 32px;
        }

        /* ===== 브랜드 ===== */
        .footer-brand {
          max-width: 260px;
        }

        .footer-brand-title {
          display: block;
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .footer-brand-desc {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: #6b7280;
        }

        /* ===== 핵심: 2 x 2 구조 ===== */
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px 60px;
        }

        .footer-title {
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .footer-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-list li {
          margin-bottom: 10px;
        }

        .footer-link {
          display: block;
          font-size: 14px;
          color: #6b7280;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #fff;
        }

        /* ===== 저작권 ===== */
        .footer-copy {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 18px;
          font-size: 13px;
        }

        /* ===== PC ===== */
        @media (min-width: 900px) {
          .footer-top {
            flex-direction: row;
            justify-content: space-between;
            gap: 80px;
          }

          .footer-brand {
            flex: 0 0 280px;
          }

          .footer-links-grid {
            flex: 1;
            grid-template-columns: repeat(2, 200px);
            gap: 40px 80px;
          }
        }

        /* ===== 모바일 ===== */
        @media (max-width: 768px) {
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 30px;
          }
        }
      `}</style>
    </footer>
  );
}