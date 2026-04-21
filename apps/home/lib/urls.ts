// ─────────────────────────────────────────────────────
// apps/home/lib/urls.ts
// 서비스 URL 단일 관리 파일
//
// 로컬 개발: apps/home/.env.local 에 NEXT_PUBLIC_URL_* 정의
// 배포 환경: Vercel 대시보드 환경변수 또는 .env.production 사용
//
// Header, Footer, 각 페이지에서 모두 이 파일을 import 하세요.
// URL 변경 시 이 파일만 수정하면 됩니다.
// ─────────────────────────────────────────────────────

export const URLS = {
  home:      process.env.NEXT_PUBLIC_URL_HOME      ?? "https://trendkit.app",
  excel:     process.env.NEXT_PUBLIC_URL_EXCEL     ?? "https://excel.trendkit.app",
  wordcloud: process.env.NEXT_PUBLIC_URL_WORDCLOUD ?? "https://wordcloud.trendkit.app",
  trends:    process.env.NEXT_PUBLIC_URL_TRENDS    ?? "https://keywords.trendkit.app",
} as const;
