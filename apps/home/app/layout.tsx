// Root Layout
// ★ 폰트: next/font로 DM Sans만 관리 (self-hosted, 중복 로딩 없음)
// ★ globals.css의 Google Fonts @import는 제거됨
import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import "../styles/globals.css";

// DM Sans 하나만 next/font로 로드 → 자동 self-hosted, 성능 최적
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  // CSS 변수로 노출 → globals.css의 --font-sans에서 사용
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrendKit — 생산성 도구 모음",
  description: "설치 없이 브라우저에서 바로 사용하는 업무 자동화 도구들",
  icons: { icon: "/favicon.ico" },
};

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={dmSans.variable}>
      <body suppressHydrationWarning>
        {adsenseClientId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        {children}
      </body>
    </html>
  );
}
