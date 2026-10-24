// 검색엔진용 사이트 정보 — 메타데이터·sitemap·robots·구조화 데이터가 같이 쓴다
import { URLS } from "./urls";

export const SITE = {
  url: URLS.home.replace(/\/$/, ""),
  name: "TrendKit",
  title: "TrendKit — 무료 온라인 생산성 도구 모음 (엑셀 병합·PDF 편집·워드클라우드·여행 코스)",
  description:
    "설치 없이 브라우저에서 바로 쓰는 무료 도구 모음. 엑셀 파일 병합, PDF 편집·병합, 뉴스 키워드 워드클라우드·트렌드 분석, 말로 찾는 반나절 여행 코스까지.",
  keywords: [
    "엑셀 병합", "엑셀 합치기", "PDF 편집", "PDF 병합", "PDF 수정", "워드클라우드 만들기",
    "키워드 트렌드", "뉴스 키워드 분석", "여행 코스 추천", "온라인 도구", "무료 웹 도구", "TrendKit",
  ],
};

// 검색 결과에 함께 보여 줄 도구들 (구조화 데이터)
export const SITE_TOOLS = [
  { name: "Excel Smart Merger", url: URLS.excel, desc: "여러 엑셀 파일을 컬럼 기준으로 병합" },
  { name: "PDF 편집기", url: URLS.pdf, desc: "PDF 편집·병합, 문서 수정과 이미지 변환" },
  { name: "워드클라우드 생성기", url: URLS.wordcloud, desc: "검색어 기반 뉴스 워드클라우드 생성" },
  { name: "키워드 트렌드", url: URLS.trends, desc: "오늘 뉴스 키워드 빈도 분석" },
  { name: "반나절 여행 코스", url: URLS.trip, desc: "말로 찾는 장소와 근처 반나절 여행 코스" },
];
