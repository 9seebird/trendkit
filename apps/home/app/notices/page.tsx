import type { Metadata } from "next";
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import NoticeList from "./NoticeList";
import "../tools/tools.css";

export const metadata: Metadata = {
  title: "공지사항",
  description: "TrendKit 새 도구 출시와 업데이트 소식",
  alternates: { canonical: "/notices" },
};

export default function NoticesPage() {
  return (
    <>
      <Header />
      <main className="tk-wrap">
        <nav className="tk-crumb" aria-label="현재 위치"><Link href="/">홈</Link> › 공지사항</nav>
        <h1 className="tk-title">공지사항</h1>
        <p className="tk-lead">새 도구 출시와 업데이트 소식이에요. 원하는 기능이 있으면 <Link href="/contact#inquiry" style={{ color: "var(--brand)" }}>문의하기</Link>로 알려 주세요.</p>
        <NoticeList />
      </main>
      <Footer />
    </>
  );
}
