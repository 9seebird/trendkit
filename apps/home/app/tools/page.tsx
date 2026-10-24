import type { Metadata } from "next";
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import AdSenseAd from "../_components/AdSenseAd";
import CatalogGrid from "../_components/CatalogGrid";
import { CATALOG } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "전체 도구 — PDF 편집, 엑셀 병합, 연봉 실수령액, 글자 수 세기, 이미지 변환, 여행 코스",
  description:
    "설치 없이 브라우저에서 바로 쓰는 무료 도구 모음. PDF 편집·병합, 엑셀 병합, 2026 연봉 실수령액·퇴직금·연차 계산기, 글자 수 세기, HEIC→JPG 변환, QR 코드, 뉴스 워드클라우드, 반나절 여행 코스.",
  alternates: { canonical: "/tools" },
};

// 서비스 페이지(/services)에 있던 질문을 합쳐 옮겼다
const FAQ = [
  { q: "프로그램을 설치하거나 회원가입해야 하나요?",
    a: "아니요. 모든 도구는 브라우저에서 바로 쓰는 웹 도구라 설치·회원가입 없이 무료로 이용할 수 있습니다." },
  { q: "입력한 파일이나 글이 서버에 저장되나요?",
    a: "글자 수 세기, 계산기, 이미지 변환, QR 코드 같은 사이트 안 도구는 모두 내 브라우저 안에서만 계산하고 서버로 보내지 않습니다. 엑셀 병합·PDF 편집 등 별도 서비스는 각 서비스의 안내를 따릅니다." },
  { q: "엑셀 병합 도구는 어떤 상황에서 유용한가요?",
    a: "날짜별 보고서, 지점별 매출 파일, 여러 담당자가 나눠 작성한 목록처럼 비슷한 컬럼 구조의 엑셀 파일 여러 개를 하나로 합칠 때 유용합니다." },
  { q: "PDF 편집기는 어떤 기능을 제공하나요?",
    a: "PDF 텍스트 수정, 페이지 추가·삭제·순서 변경, 여러 PDF 병합, PDF와 이미지·문서 형식 사이의 변환을 제공합니다." },
  { q: "워드클라우드와 키워드 트렌드는 무엇이 다른가요?",
    a: "워드클라우드는 검색어로 모은 뉴스에서 자주 나온 단어를 크기로 보여 주고, 키워드 트렌드는 오늘 뉴스 전체에서 많이 언급된 키워드를 차트로 순위를 보여 줍니다." },
  { q: "결과를 바로 다운로드할 수 있나요?",
    a: "도구에 따라 병합 결과 엑셀, 변환한 이미지·ZIP, QR 코드 PNG·SVG, 워드클라우드 이미지·CSV 등으로 바로 받을 수 있습니다." },
];

export default function ToolsIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="tk-wrap" style={{ maxWidth: 1100 }}>
        <nav className="tk-crumb" aria-label="현재 위치"><Link href="/">홈</Link> › 도구</nav>
        <h1 className="tk-title">전체 도구 {CATALOG.length}개</h1>
        <p className="tk-lead">
          회원가입이나 설치 없이 브라우저에서 바로 쓰는 무료 도구입니다. ↗ 표시는 새 창에서 열리는 별도 서비스예요.
        </p>
        <CatalogGrid />
        <AdSenseAd label="도구 목록 광고" />
        <section className="tk-article">
          <h2>TrendKit 도구는 이렇게 만들어요</h2>
          <p>
            일하다 보면 반복되는 작은 일들이 있습니다. 엑셀 파일 여러 개를 하나로 합치거나, 자기소개서 글자 수를 세거나,
            아이폰 사진을 JPG로 바꾸는 일처럼요. TrendKit은 이런 일을 프로그램 설치 없이 브라우저에서 바로 끝낼 수 있게
            만드는 도구 모음입니다.
          </p>
          <ul>
            <li><b>설치·가입 없음</b> — 주소만 열면 바로 씁니다.</li>
            <li><b>개인정보 보호</b> — 계산기·변환 도구는 입력값을 서버로 보내지 않고 내 기기 안에서 처리합니다.</li>
            <li><b>최신 기준 반영</b> — 연봉·퇴직금·연차 계산은 2026년 요율과 법 기준을 반영합니다.</li>
          </ul>
        </section>
        <section className="tk-faq tk-article">
          <h2>자주 묻는 질문</h2>
          {FAQ.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
