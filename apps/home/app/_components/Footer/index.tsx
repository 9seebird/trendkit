import Link from "next/link";
import { URLS } from "@/lib/urls";

const FOOTER_LINKS: Record<string, { label: string; href: string; external?: boolean }[]> = {
  서비스: [
    { label: "Excel Merger", href: URLS.excel, external: true },
    { label: "워드클라우드", href: URLS.wordcloud, external: true },
    { label: "키워드 트렌드", href: URLS.trends, external: true },
  ],
  회사: [
    { label: "소개", href: "/about" },
    { label: "비전", href: "/about#vision" },
  ],
  고객지원: [
    { label: "공지사항", href: "/contact#notice" },
    { label: "문의하기", href: "/contact#inquiry" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#111",
        color: "#6b7280",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 0 22px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* 브랜드 영역 */}
        <div className="footer-brand">
          <span className="footer-brand-title">TrendKit</span>
          <p className="footer-brand-desc">
            설치 없이 브라우저에서 바로 사용하는
            <br />
            업무 자동화 도구 모음.
          </p>
        </div>

        {/* 링크 영역 */}
        <div className="footer-links-grid">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="footer-title">{category}</h4>
              <ul className="footer-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
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

        {/* 저작권 */}
        <div className="footer-copy">
          © 2026 TrendKit. All rights reserved.
        </div>
      </div>

      <style>{`
        .footer-brand {
          margin-bottom: 28px;
          max-width: 240px;
        }

        .footer-brand-title {
          display: block;
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .footer-brand-desc {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: #6b7280;
          word-break: keep-all;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .footer-title {
          margin: 0 0 12px;
          font-size: 13px;
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
          color: #6b7280;
          text-decoration: none;
          font-size: 13px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .footer-copy {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 16px;
          font-size: 12px;
          color: #6b7280;
        }

        @media (min-width: 769px) {
          .footer-brand {
            margin-bottom: 36px;
            max-width: 280px;
          }

          .footer-brand-title {
            font-size: 20px;
          }

          .footer-brand-desc {
            font-size: 14px;
          }

          .footer-links-grid {
            gap: 32px;
            margin-bottom: 36px;
          }

          .footer-title {
            font-size: 14px;
          }

          .footer-link {
            font-size: 14px;
          }

          .footer-copy {
            padding-top: 20px;
            font-size: 13px;
          }
        }

        @media (max-width: 380px) {
          .footer-links-grid {
            gap: 16px;
          }

          .footer-title {
            font-size: 12px;
          }

          .footer-link {
            font-size: 12px;
          }
        }
      `}</style>
    </footer>
  );
}