// 생활·업무 도구 목록 (trendkit.app/tools/*)
// 도구 목록 페이지·관련 도구·sitemap·홈 카드가 이 목록 하나를 같이 쓴다.
// 새 도구를 만들면 app/tools/<slug>/page.tsx 를 만들고 여기 한 줄 추가.

import type { Category } from "./catalog";

export type ToolInfo = {
  slug: string;
  name: string;        // 화면·검색 결과 제목
  short: string;       // 카드 한 줄 설명
  icon: string;
  iconBg: string;
  group: Category;
  keywords: string[];  // 검색어 (메타 키워드·본문 설명에 반영)
};

export const TOOLS: ToolInfo[] = [
  {
    slug: "character-count",
    name: "글자 수 세기",
    short: "공백 포함·제외 글자 수, 바이트, 원고지 매수까지 바로 세기. 자기소개서 글자 수 확인",
    icon: "🔤", iconBg: "#e0e7ff", group: "문서·파일",
    keywords: ["글자수 세기", "글자 수 세기", "자소서 글자수", "공백 제외 글자수", "바이트 계산"],
  },
  {
    slug: "salary-calculator",
    name: "연봉 실수령액 계산기",
    short: "2026년 4대보험·소득세 기준으로 연봉에서 매달 받는 돈 계산",
    icon: "💰", iconBg: "#dcfce7", group: "계산기",
    keywords: ["연봉 실수령액", "실수령액 계산기", "2026 연봉 실수령액", "월급 실수령액", "4대보험 계산"],
  },
  {
    slug: "severance-pay",
    name: "퇴직금 계산기",
    short: "입사일·퇴사일과 최근 3개월 급여로 예상 퇴직금 계산",
    icon: "🧾", iconBg: "#fef3c7", group: "계산기",
    keywords: ["퇴직금 계산기", "퇴직금 계산", "평균임금 계산", "퇴직금 계산 방법"],
  },
  {
    slug: "annual-leave",
    name: "연차 계산기",
    short: "입사일 기준으로 올해 연차 일수와 근속연수별 연차 계산",
    icon: "🏖️", iconBg: "#ccfbf1", group: "계산기",
    keywords: ["연차 계산기", "연차 일수 계산", "입사일 기준 연차", "1년 미만 연차"],
  },
  {
    slug: "date-calculator",
    name: "날짜 계산기",
    short: "D-day, 두 날짜 사이 일수, 며칠 뒤 날짜, 만 나이 계산",
    icon: "📅", iconBg: "#fee2e2", group: "계산기",
    keywords: ["날짜 계산기", "디데이 계산기", "D-day 계산", "만나이 계산기", "날짜 사이 일수"],
  },
  {
    slug: "image-converter",
    name: "이미지 변환·압축",
    short: "HEIC→JPG, PNG·WEBP 변환과 용량 줄이기. 사진은 서버로 올라가지 않아요",
    icon: "🖼️", iconBg: "#ede9fe", group: "문서·파일",
    keywords: ["HEIC JPG 변환", "이미지 용량 줄이기", "사진 용량 줄이기", "PNG JPG 변환", "WEBP 변환"],
  },
  {
    slug: "qr-code",
    name: "QR 코드 만들기",
    short: "링크·글·와이파이 QR 코드를 무료로 만들고 PNG·SVG로 저장",
    icon: "🔳", iconBg: "#f1f5f9", group: "생활·여행",
    keywords: ["QR코드 만들기", "QR 코드 생성", "와이파이 QR코드", "무료 QR코드"],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug)!;
