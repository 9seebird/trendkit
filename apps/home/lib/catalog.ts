// TrendKit 전체 도구 목록 — 외부 서비스(하위 도메인)와 사이트 안 도구(/tools/*)를 한곳에.
// 홈·도구 목록·푸터·관련 도구·구조화 데이터가 모두 이 목록을 쓴다.
// 새 도구는 여기(외부 서비스) 또는 lib/tools.ts(사이트 안 도구)에 한 줄 추가하면 모든 화면에 반영된다.
import { URLS } from "./urls";
import { TOOLS } from "./tools";

export const CATEGORIES = ["문서·파일", "계산기", "분석", "생활·여행", "구독·결제"] as const;
export type Category = (typeof CATEGORIES)[number];

export type CatalogItem = {
  key: string;
  name: string;
  short: string;
  icon: string;
  iconBg: string;
  category: Category;
  href: string;
  external: boolean;       // 하위 도메인(새 창)
};

const SERVICES: CatalogItem[] = [
  { key: "pdf", name: "PDF 편집기", short: "PDF 편집·병합, 문서 수정과 이미지 변환", icon: "📄", iconBg: "#fef3c7",
    category: "문서·파일", href: URLS.pdf, external: true },
  { key: "excel", name: "Excel Smart Merger", short: "여러 엑셀 파일을 컬럼 기준으로 병합하고 바로 다운로드", icon: "📊", iconBg: "#dbeafe",
    category: "문서·파일", href: URLS.excel, external: true },
  { key: "trip", name: "반나절 여행 코스", short: "“비 오는 날 아이랑 갈 만한 곳”처럼 말하면 여행지와 주변 반나절 코스를 추천해 드려요", icon: "🧭", iconBg: "#ccfbf1",
    category: "생활·여행", href: URLS.trip, external: true },
  { key: "wordcloud", name: "워드클라우드 생성기", short: "검색어 기반 뉴스 워드클라우드. 이미지·CSV 다운로드", icon: "☁️", iconBg: "#e0f2fe",
    category: "분석", href: URLS.wordcloud, external: true },
  { key: "trends", name: "키워드 트렌드", short: "오늘 뉴스 키워드 빈도를 차트와 태그 클라우드로", icon: "📈", iconBg: "#dcfce7",
    category: "분석", href: URLS.trends, external: true },
];

// 홈, 전체 도구, 푸터에서 공통으로 쓰는 순서. 목록에 없는 새 도구는 뒤에 표시한다.
const CATALOG_ORDER = [
  "trip",
  "subscription-cancel",
  "pdf",
  "salary-calculator",
  "image-converter",
  "character-count",
  "excel",
  "qr-code",
  "date-calculator",
  "annual-leave",
  "severance-pay",
  "trends",
  "wordcloud",
];
const catalogRank = new Map(CATALOG_ORDER.map((key, index) => [key, index]));

export const CATALOG: CatalogItem[] = [
  ...SERVICES,
  ...TOOLS.map((t) => ({
    key: t.slug, name: t.name, short: t.short, icon: t.icon, iconBg: t.iconBg, category: t.group,
    href: `/tools/${t.slug}`, external: false,
  })),
].sort((a, b) =>
  (catalogRank.get(a.key) ?? CATALOG_ORDER.length) - (catalogRank.get(b.key) ?? CATALOG_ORDER.length)
  || CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
