// 검색엔진용 사이트 정보 — 메타데이터·sitemap·robots·구조화 데이터가 같이 쓴다
import { URLS } from "./urls";

export const SITE = {
  url: URLS.home.replace(/\/$/, ""),
  name: "TrendKit",
  title: "TrendKit — 무료 온라인 도구 모음 (PDF 편집·엑셀 병합·연봉 계산기·글자 수 세기·여행 코스)",
  description:
    "설치 없이 브라우저에서 바로 쓰는 무료 도구 모음. PDF 편집·병합, 엑셀 병합, 2026 연봉 실수령액·퇴직금·연차 계산기, 글자 수 세기, HEIC→JPG 변환, QR 코드, 뉴스 워드클라우드, 말로 찾는 반나절 여행 코스까지.",
  keywords: [
    "엑셀 병합", "엑셀 합치기", "PDF 편집", "PDF 병합", "PDF 수정", "워드클라우드 만들기",
    "키워드 트렌드", "뉴스 키워드 분석", "여행 코스 추천", "연봉 실수령액 계산기", "퇴직금 계산기",
    "연차 계산기", "글자수 세기", "HEIC JPG 변환", "QR코드 만들기", "날짜 계산기", "무료 웹 도구", "TrendKit",
  ],
};
