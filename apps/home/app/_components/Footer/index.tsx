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
        padding: "48px 0 24px",
      }}
    >
      {/* 
        핵심 1)
        기존에는 Footer 전용 maxWidth/padding을 따로 써서
        메인 컨텐츠와 시작선이 미묘하게 달라 보일 수 있었습니다.

        여기서는 container-main 클래스를 같이 써서
        페이지 전체 본문 시작선과 맞추는 방향으로 정리합니다.
      */}
      <div className="container-main footer-inner">
        {/* 
          핵심 2)
          PC에서는 브랜드 + 링크영역을 가로로 배치해서
          왼쪽으로 쏠린 느낌을 줄입니다.
          
          모바일에서는 자동으로 세로 배치됩니다.
        */}
        <div className="footer-top">
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
              <div key={category} className="footer-col">
                <h4 className="footer-title">{category}</h4>

                <ul className="footer-list">
                  {links.map((link) => (
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

        {/* 저작권 */}
        <div className="footer-copy">
          © 2026 TrendKit. All rights reserved.
        </div>
      </div>

      <style>{`
        /* =====================================================
           Footer 공통 래퍼
           - container-main과 함께 사용
           - 메인 컨텐츠와 시작선 맞추기 용도
           ===================================================== */
        .footer-inner {
          position: relative;
        }

        /* =====================================================
           상단 영역
           - 모바일: 세로
           - PC: 브랜드 / 링크 가로 배치
           ===================================================== */
        .footer-top {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-bottom: 28px;
        }

        /* =====================================================
           브랜드 영역
           ===================================================== */
        .footer-brand {
          max-width: 260px;
        }

        .footer-brand-title {
          display: block;
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .footer-brand-desc {
          margin: 0;
          font-size: 14px;
          line-height: 1.75;
          color: #6b7280;
          word-break: keep-all;
        }

        /* =====================================================
           링크 그리드
           - 모바일에서는 3열 유지
           - PC에서는 브랜드 오른쪽 영역 안에서 3열
           ===================================================== */
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .footer-col {
          min-width: 0;
        }

        .footer-title {
          margin: 0 0 14px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          line-height: 1.4;
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
          line-height: 1.6;
          word-break: keep-all;
        }

        .footer-link:hover {
          color: #fff;
        }

        /* =====================================================
           저작권
           ===================================================== */
        .footer-copy {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 18px;
          font-size: 13px;
          color: #6b7280;
        }

        /* =====================================================
           태블릿 이상
           - 브랜드 / 링크를 좌우 배치
           - 이게 PC에서 왼쪽 치우친 느낌을 줄이는 핵심
           ===================================================== */
        @media (min-width: 900px) {
          .footer-top {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 56px;
            margin-bottom: 40px;
          }

          .footer-brand {
            flex: 0 0 280px;
            max-width: 280px;
          }

          .footer-links-grid {
            flex: 1;
            grid-template-columns: repeat(3, minmax(140px, 1fr));
            gap: 36px;
            align-items: start;
          }

          .footer-title {
            font-size: 14px;
          }

          .footer-link {
            font-size: 14px;
          }
        }

        /* =====================================================
           모바일
           - 기존 사용자님이 괜찮다고 느끼신 구조 유지
           - 위 브랜드 / 아래 링크 3열
           ===================================================== */
        @media (max-width: 768px) {
          .footer-top {
            gap: 24px;
            margin-bottom: 24px;
          }

          .footer-brand {
            max-width: 240px;
          }

          .footer-brand-title {
            font-size: 18px;
          }

          .footer-brand-desc {
            font-size: 13px;
          }

          .footer-links-grid {
            gap: 18px;
          }

          .footer-title {
            font-size: 13px;
            margin-bottom: 12px;
          }

          .footer-link {
            font-size: 13px;
          }

          .footer-copy {
            padding-top: 16px;
            font-size: 12px;
          }
        }

        /* 아주 작은 모바일 */
        @media (max-width: 380px) {
          .footer-links-grid {
            gap: 14px;
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