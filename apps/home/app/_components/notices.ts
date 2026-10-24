// 공지 목록 — 문의 페이지(최근 몇 개)와 공지사항 페이지(전체)가 같이 쓴다.
// 관리 화면에서 올린 공지(Supabase, /api/contact)가 있으면 그걸, 없으면 아래 기본 공지를 보여 준다.
import { useEffect, useState } from "react";

export type Notice = {
  id: string;
  tag: string;
  tagColor: string;
  tagText: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
};

export const FALLBACK_NOTICES: Notice[] = [
  { id: "fallback_9", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "반나절 여행 코스 출시!", content: "가고 싶은 곳을 말로 적으면 장소와 근처 반나절 코스를 찾아 드려요. trip.trendkit.app", date: "2026.10.24", isPublished: true },
  { id: "fallback_8", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "퇴직금·연차 계산기 추가", content: "입사일과 최근 급여로 예상 퇴직금을, 입사일로 연차 일수를 계산해요. trendkit.app/tools", date: "2026.10.22", isPublished: true },
  { id: "fallback_7", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "2026 연봉 실수령액 계산기 추가", content: "2026년 4대보험 요율과 소득세를 반영해 매달 받는 금액을 계산해요.", date: "2026.10.20", isPublished: true },
  { id: "fallback_6", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "이미지 변환·압축 도구 추가", content: "HEIC→JPG, WEBP 변환과 사진 용량 줄이기. 사진은 서버로 올라가지 않아요.", date: "2026.10.17", isPublished: true },
  { id: "fallback_5", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "QR 코드 만들기 추가", content: "링크·글·와이파이 QR 코드를 만들고 PNG·SVG로 저장할 수 있어요.", date: "2026.10.14", isPublished: true },
  { id: "fallback_4", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "날짜 계산기 추가", content: "D-day, 날짜 사이 일수, 100일 기념일, 만 나이를 한 곳에서 계산해요.", date: "2026.10.10", isPublished: true },
  { id: "fallback_3", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "글자 수 세기 추가", content: "자기소개서·리포트 글자 수를 공백 포함·제외, 바이트까지 바로 세요.", date: "2026.10.06", isPublished: true },
  { id: "fallback_2", tag: "출시", tagColor: "#dbeafe", tagText: "#1d4ed8", title: "PDF 편집기 정식 출시!", content: "PDF 편집·병합, 문서 수정과 이미지 변환을 브라우저에서 바로 쓸 수 있어요.", date: "2026.10.01", isPublished: true },
  { id: "fallback_1", tag: "공지", tagColor: "#dcfce7", tagText: "#15803d", title: "TrendKit 서비스 정식 오픈!", content: "TrendKit 서비스가 정식 오픈했습니다.", date: "2026.04.21", isPublished: true },
];

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>(FALLBACK_NOTICES);
  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.notices) && data.notices.length > 0) setNotices(data.notices);
      })
      .catch(() => undefined);
  }, []);
  return notices;
}
