import type { Metadata } from "next";
import ToolPage, { toolMetadata } from "../_components/ToolPage";
import Converter from "./Converter";

const SLUG = "image-converter";
export const metadata: Metadata = toolMetadata(
  SLUG,
  "이미지 변환·압축 — HEIC JPG 변환, 사진 용량 줄이기",
  "아이폰 HEIC 사진을 JPG로 바꾸고, PNG·WEBP 변환과 사진 용량 줄이기를 한 번에. 여러 장을 한꺼번에 처리하고 ZIP으로 받기. 사진은 서버로 올라가지 않아요.",
);

const FAQ = [
  { q: "아이폰 HEIC 사진이 컴퓨터에서 안 열려요.",
    a: "HEIC는 아이폰 기본 사진 형식이라 일부 프로그램과 웹사이트가 열지 못합니다. 여기서 JPG를 고르고 변환하면 어디서나 열리는 사진으로 바뀝니다. 아이폰 설정 → 카메라 → 포맷에서 '높은 호환성'을 고르면 처음부터 JPG로 찍힙니다." },
  { q: "사진이 서버에 저장되나요?",
    a: "아니요. 변환은 모두 브라우저 안에서 이루어지고 사진은 어디에도 업로드되지 않습니다. 창을 닫으면 사라집니다." },
  { q: "용량을 가장 많이 줄이려면 어떻게 하나요?",
    a: "형식을 WEBP나 JPG로, 화질을 70~80%로, 크기를 1920px 정도로 줄이면 화면에서 보기에는 거의 차이 없이 용량이 크게 줄어듭니다. 인쇄용이라면 원본 크기를 유지하세요." },
  { q: "PNG로 바꿨더니 용량이 오히려 커졌어요.",
    a: "PNG는 화질을 잃지 않는 형식이라 사진은 오히려 커질 수 있습니다. 사진은 JPG나 WEBP, 투명 배경이 필요한 로고·캡처 이미지는 PNG가 알맞습니다." },
];

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      lead="HEIC를 JPG로, PNG를 WEBP로 바꾸고 사진 용량을 줄입니다. 여러 장을 한 번에 처리하고, 사진은 내 기기 밖으로 나가지 않아요."
      faq={FAQ}
      related={["qr-code", "character-count"]}
      article={
        <>
          <h2>형식별 차이</h2>
          <ul>
            <li><b>JPG</b> — 사진에 알맞고 어디서나 열립니다. 투명 배경은 흰색이 됩니다.</li>
            <li><b>PNG</b> — 화질 손실이 없고 투명 배경을 지원합니다. 캡처·로고에 좋지만 사진은 용량이 큽니다.</li>
            <li><b>WEBP</b> — 같은 화질에서 JPG보다 25~35% 작습니다. 블로그·쇼핑몰 이미지에 좋습니다.</li>
            <li><b>HEIC</b> — 아이폰 기본 형식. 용량은 작지만 호환되는 곳이 적어 JPG로 바꿔 쓰는 경우가 많습니다.</li>
          </ul>
          <h2>사진 용량 줄이는 요령</h2>
          <ol>
            <li>올릴 곳의 최대 크기를 확인합니다 (예: 블로그 본문은 1920px이면 충분).</li>
            <li>크기를 줄이고, 화질은 75~85% 사이로 둡니다. 이 범위에서는 눈으로 차이를 느끼기 어렵습니다.</li>
            <li>그래도 크면 WEBP를 고르세요. 첨부 파일 용량 제한이 있는 곳에 특히 좋습니다.</li>
          </ol>
          <p>변환할 때 사진 속 위치·촬영 정보(EXIF)는 함께 지워져 개인정보 노출도 줄어듭니다.</p>
        </>
      }
    >
      <Converter />
    </ToolPage>
  );
}
