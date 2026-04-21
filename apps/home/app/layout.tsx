// ─────────────────────────────────────────────────────
// Root Layout — 모든 페이지를 감싸는 최상위 레이아웃
//
// ★ 메타데이터 수정: metadata 객체를 편집하세요.
// ★ 폰트 변경: dmSans / dmSerif 설정을 편집하세요.
// ★ 전역 CSS: '../styles/globals.css' 에서 관리합니다.
// ─────────────────────────────────────────────────────
import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "../styles/globals.css";

/* ── 웹폰트 설정 (Next.js 자동 최적화) ──
   next/font 를 사용하면 폰트가 자동으로 self-hosted 됩니다.
   Google Fonts 에 별도 요청을 보내지 않아 성능·프라이버시에 유리합니다. */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",  // CSS 변수로 참조: var(--font-dm-sans)
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif", // CSS 변수로 참조: var(--font-dm-serif)
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/* ── SEO 메타데이터 ──
   title, description 등을 여기서 편집하세요.
   각 page.tsx 에서 export const metadata 로 오버라이드 가능합니다. */
export const metadata: Metadata = {
  title: "TrendKit — 생산성 도구 모음",
  description: "설치 없이 브라우저에서 바로 사용하는 업무 자동화 도구들",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* lang="ko" — 스크린리더·SEO 를 위해 언어 명시 */
    <html lang="ko" className={`${dmSans.variable} ${dmSerif.variable}`}>
      {/* suppressHydrationWarning: 다크모드 토글 시 hydration 경고 방지 */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
