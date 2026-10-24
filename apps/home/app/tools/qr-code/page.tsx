import type { Metadata } from "next";
import ToolPage, { toolMetadata } from "../_components/ToolPage";
import QrTool from "./QrTool";

const SLUG = "qr-code";
export const metadata: Metadata = toolMetadata(
  SLUG,
  "QR 코드 만들기 — 링크·와이파이 QR 무료 생성",
  "링크, 글, 와이파이 접속 QR 코드를 무료로 만들고 PNG·SVG로 저장합니다. 기간 제한·워터마크 없음, 색상 변경 가능. 내용은 서버로 보내지 않아요.",
);

const FAQ = [
  { q: "만든 QR 코드에 사용 기간이 있나요?",
    a: "없습니다. 링크나 글이 QR 코드 그림 안에 그대로 들어 있어서, 이 사이트가 없어져도 계속 작동합니다. 일부 유료 사이트의 '동적 QR'과 달리 중간 서버를 거치지 않습니다." },
  { q: "와이파이 QR 코드는 어떻게 쓰나요?",
    a: "휴대폰 카메라로 찍으면 '네트워크에 연결' 알림이 뜨고, 누르면 비밀번호 입력 없이 접속됩니다. 카페·사무실·숙소 안내문에 붙여 두기 좋습니다." },
  { q: "인쇄용으로는 어떤 파일이 좋나요?",
    a: "SVG는 아무리 키워도 깨지지 않아 인쇄·디자인 프로그램에 좋습니다. 문서나 메신저에 붙일 때는 PNG(1024×1024)가 편합니다." },
  { q: "색을 바꿔도 잘 인식되나요?",
    a: "QR 색은 진하게, 배경은 밝게 두면 대부분 인식됩니다. 반대로(밝은 QR, 어두운 배경) 하면 못 읽는 휴대폰이 있으니 피하세요. 로고를 덮을 계획이면 오류 복원을 '높음' 이상으로 고르세요." },
];

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      lead="링크·글·와이파이 정보를 넣으면 바로 QR 코드가 만들어집니다. 색을 바꾸고 PNG·SVG로 저장하세요. 워터마크·기간 제한 없어요."
      faq={FAQ}
      related={["image-converter", "character-count", "date-calculator"]}
      article={
        <>
          <h2>이럴 때 쓰세요</h2>
          <ul>
            <li><b>링크</b> — 명함, 전단지, 메뉴판, 발표 자료에 홈페이지·설문·예약 링크.</li>
            <li><b>와이파이</b> — 매장·사무실·숙소에서 비밀번호를 불러 주지 않고 바로 접속.</li>
            <li><b>글</b> — 연락처, 계좌 안내, 짧은 안내 문구.</li>
          </ul>
          <h2>잘 읽히는 QR 코드 만드는 법</h2>
          <ol>
            <li>링크는 짧을수록 점이 적어 멀리서도 잘 읽힙니다.</li>
            <li>인쇄 크기는 최소 2cm 이상, 멀리서 찍을 포스터는 거리의 1/10 정도로 키웁니다.</li>
            <li>QR 둘레에 여백(흰 테두리)을 남겨 두세요. 그림에 기본으로 들어 있습니다.</li>
          </ol>
        </>
      }
    >
      <QrTool />
    </ToolPage>
  );
}
