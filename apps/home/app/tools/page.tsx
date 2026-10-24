import type { Metadata } from "next";
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import AdSenseAd from "../_components/AdSenseAd";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "무료 생활·업무 도구 — 글자 수 세기, 연봉 실수령액, 퇴직금, 날짜 계산, 이미지 변환, QR 코드",
  description:
    "설치 없이 바로 쓰는 무료 도구 모음. 자기소개서 글자 수 세기, 2026 연봉 실수령액·퇴직금·연차 계산기, D-day·만 나이 계산, HEIC→JPG 변환, QR 코드 만들기.",
  alternates: { canonical: "/tools" },
};

const GROUPS = ["문서", "계산기", "이미지", "생활"] as const;

export default function ToolsIndex() {
  return (
    <>
      <Header />
      <main className="tk-wrap" style={{ maxWidth: 1100 }}>
        <nav className="tk-crumb"><Link href="/">TrendKit</Link> › 도구</nav>
        <h1 className="tk-title">무료 생활·업무 도구</h1>
        <p className="tk-lead">
          회원가입이나 설치 없이 브라우저에서 바로 씁니다. 입력한 글·숫자·사진은 서버로 보내지 않고 내 기기 안에서만 계산해요.
        </p>
        {GROUPS.map((g) => {
          const list = TOOLS.filter((t) => t.group === g);
          if (!list.length) return null;
          return (
            <section key={g} className="tk-related" style={{ marginTop: 28 }}>
              <h2>{g}</h2>
              <div className="tk-cards">
                {list.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="tk-card">
                    <span className="ic" style={{ background: t.iconBg }}>{t.icon}</span>
                    <span><b>{t.name}</b><small>{t.short}</small></span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
        <AdSenseAd label="도구 목록 광고" />
      </main>
      <Footer />
    </>
  );
}
