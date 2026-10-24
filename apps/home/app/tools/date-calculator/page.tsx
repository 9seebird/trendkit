import type { Metadata } from "next";
import ToolPage, { toolMetadata } from "../_components/ToolPage";
import DateTool from "./DateTool";

const SLUG = "date-calculator";
export const metadata: Metadata = toolMetadata(
  SLUG,
  "날짜 계산기 — D-day, 날짜 사이 일수, 100일 계산, 만 나이",
  "D-day 계산, 두 날짜 사이 일수, 며칠 뒤 날짜(100일·1000일 기념일), 만 나이를 한 곳에서 계산합니다. 무료, 설치 없음.",
);

const FAQ = [
  { q: "100일 기념일은 어떻게 세나요?",
    a: "사귄 날(시작일)을 1일로 세는 것이 일반적입니다. '시작일을 1일로 세기'를 켜면 시작일부터 99일 뒤가 100일째로 나옵니다." },
  { q: "만 나이는 어떻게 계산하나요?",
    a: "현재 연도에서 태어난 연도를 빼고, 올해 생일이 아직 지나지 않았으면 1을 더 뺍니다. 2023년 6월부터 법과 행정에서는 만 나이를 기본으로 씁니다." },
  { q: "날짜 사이 일수에 시작일도 포함되나요?",
    a: "기본은 두 날짜의 차이(시작일 제외)입니다. 숙박·근무일처럼 양 끝을 모두 세야 하면 '시작일을 1일로 세기'를 켜세요." },
];

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      lead="D-day, 두 날짜 사이가 며칠인지, 며칠 뒤가 무슨 날인지, 만 나이가 몇 살인지 한 번에 계산합니다."
      faq={FAQ}
      related={["annual-leave", "character-count", "qr-code"]}
      article={
        <>
          <h2>이럴 때 쓰세요</h2>
          <ul>
            <li><b>D-day</b> — 시험, 여행, 결혼식, 전역일까지 남은 날.</li>
            <li><b>날짜 사이 일수</b> — 계약 기간, 근무 기간, 임신 주수 어림.</li>
            <li><b>며칠 뒤 날짜</b> — 100일·200일·1000일 기념일, 반품·환불 기한.</li>
            <li><b>만 나이</b> — 서류, 보험, 청약 자격 확인.</li>
          </ul>
          <h2>계산 기준</h2>
          <p>
            모든 계산은 내 기기의 날짜(한국 시간)를 기준으로 자정 단위로 합니다. 윤년(2월 29일)은 자동으로 반영되고,
            '개월'·'년' 환산은 평균값(한 달 30.44일, 1년 365.25일)으로 어림한 것입니다.
          </p>
        </>
      }
    >
      <DateTool />
    </ToolPage>
  );
}
