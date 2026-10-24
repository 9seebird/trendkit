// Root Layout
// ★ 폰트: next/font로 DM Sans만 관리 (self-hosted, 중복 로딩 없음)
// ★ globals.css의 Google Fonts @import는 제거됨
import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import "../styles/globals.css";
import { SITE } from "@/lib/site";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// 검색엔진·공유 미리보기용 기본값. 페이지마다 title·description 을 덮어쓴다
// 사이트 소유 확인 값은 Vercel 환경변수로 (구글 서치 콘솔 / 네이버 서치어드바이저에서 받은 content 값)
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s | TrendKit" },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    // 네이버 소유 확인 태그는 아래 <head> 에 직접 넣었다 (중복되지 않게 여기서는 뺌)
  },
};

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={dmSans.variable}>
      <head>
        {/* 네이버 서치어드바이저 소유 확인 — 메타데이터 API 와 별개로 <head> 에 직접 둔다
            (Next 15 는 일부 요청에 메타데이터를 본문 쪽으로 늦게 보내서 네이버 확인기가 못 찾을 수 있다) */}
        <meta name="naver-site-verification" content="36011dc835246b43673663994d590688e1f57687" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J0SPX7FT4J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J0SPX7FT4J');
          `}
        </Script>
        {/* End Google Analytics */}
        {adsenseClientId ? (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
