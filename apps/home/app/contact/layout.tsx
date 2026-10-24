import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지 & 문의",
  description: "TrendKit 서비스 공지사항을 확인하고, 원하는 기능이나 개선 요청을 남겨 주세요.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "공지 & 문의 | TrendKit", description: "TrendKit 서비스 공지사항을 확인하고, 원하는 기능이나 개선 요청을 남겨 주세요.", url: "/contact" },
};

// 문의 화면(page.tsx)이 클라이언트 컴포넌트라 메타데이터는 여기서 준다
export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
