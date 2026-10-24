import type { Metadata } from "next";

// 관리 화면은 검색에 나오지 않게
export const metadata: Metadata = {
  title: "관리",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
