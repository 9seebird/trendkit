import type { Metadata } from "next";
import ToolPage, { toolMetadata } from "../_components/ToolPage";
import SubscriptionFinder from "./SubscriptionFinder";

const SLUG = "subscription-cancel";

export const metadata: Metadata = toolMetadata(
  SLUG,
  "구독 해지 찾기 — 무료 체험 자동 결제 확인과 구독 취소 경로",
  "무료 체험이 끝나면 결제되는지 확인하고 구독 취소 경로를 찾아보세요. 넷플릭스, YouTube Premium, ChatGPT, Spotify와 Apple·Google Play 결제처의 공식 안내를 연결합니다.",
);

const FAQ = [
  {
    q: "무료 체험이 끝나면 자동으로 결제되나요?",
    a: "서비스와 가입 경로, 계정별 오퍼에 따라 다릅니다. 가입 당시 표시된 체험 종료일과 다음 결제 조건을 확인하세요. YouTube Premium 무료 체험은 체험 종료 전 취소하지 않으면 등록한 결제 수단으로 현재 멤버십 가격이 자동 청구된다고 안내합니다.",
  },
  {
    q: "서비스에서 해지 버튼이 보이지 않아요.",
    a: "App Store, Google Play, 통신사 또는 제휴사를 통해 결제하면 서비스 계정에 해지 메뉴가 없을 수 있습니다. 가입 확인 이메일이나 카드·통신 요금 명세서에서 실제 청구 회사를 확인한 뒤 해당 결제처에서 해지하세요.",
  },
  {
    q: "앱을 삭제하면 구독도 취소되나요?",
    a: "아니요. 앱 삭제와 구독 취소는 별도입니다. 가입한 서비스나 App Store, Google Play, 통신사의 구독 관리 화면에서 취소 완료 상태를 확인하세요.",
  },
  {
    q: "이미 결제된 금액도 자동으로 환불되나요?",
    a: "구독 취소는 보통 이후 갱신을 중지하는 절차이며, 이미 결제된 금액의 환불은 별도로 요청해야 합니다. 환불 가능 여부와 절차는 실제 청구한 결제처의 안내를 확인하세요.",
  },
];

export default function SubscriptionCancelPage() {
  return (
    <ToolPage
      slug={SLUG}
      lead="무료 체험 종료 뒤 자동 결제가 걱정되거나 해지 메뉴를 찾기 어렵다면, 서비스 이름과 결제한 곳을 골라 공식 관리 페이지와 취소 절차를 확인하세요."
      faq={FAQ}
      related={["date-calculator", "character-count", "salary-calculator"]}
      article={
        <>
          <h2>무료 체험이 끝나기 전에 확인할 내용</h2>
          <p>
            가입 화면이나 확인 이메일에서 체험 종료일, 체험 후 요금, 다음 결제일을 확인하세요. YouTube는 무료 체험이 종료될 때까지 취소하지 않으면 등록한 결제 수단으로 현재 멤버십 가격이 자동 청구된다고 안내하며, 체험 길이와 자격은 계정에 따라 달라질 수 있습니다. <a href="https://support.google.com/youtube/answer/10324204?hl=ko" target="_blank" rel="noreferrer">YouTube 무료 체험 공식 안내</a>
          </p>
          <p>
            이 도구는 사용자의 계정이나 가입 당시 오퍼를 조회하지 않습니다. 각 서비스의 구독 관리 화면에서 다음 결제일과 갱신 상태를 확인하는 방식으로 안내합니다.
          </p>

          <h2>해지 버튼이 보이지 않으면 결제처를 확인하세요</h2>
          <ol>
            <li>메일에서 서비스 이름과 영수증, 구독, 결제를 검색합니다.</li>
            <li>Apple 계정이나 Google Play의 구독 목록에서 해당 서비스가 보이는지 확인합니다.</li>
            <li>통신 요금이나 카드 명세서에 다른 회사가 표시되면 그 결제처의 앱이나 고객센터에서 해지합니다.</li>
            <li>마지막으로 구독 상태가 취소 또는 만료 예정으로 바뀌었는지 확인합니다.</li>
          </ol>
          <p>
            Apple은 무료 체험을 갱신하지 않으려면 체험 종료 최소 24시간 전에 취소하라고 안내합니다. Google Play 구독은 앱을 삭제해도 취소되지 않으므로 구독 관리 화면에서 직접 취소해야 합니다. <a href="https://support.apple.com/ko-kr/118428" target="_blank" rel="noreferrer">Apple 구독 취소 안내</a> · <a href="https://support.google.com/googleplay/answer/7018481?hl=ko" target="_blank" rel="noreferrer">Google Play 정기 결제 취소 안내</a>
          </p>

          <h2>해지와 환불은 별도로 확인하세요</h2>
          <p>
            구독을 취소하면 이후 갱신이 중지되는지 확인하고, 이미 결제된 금액은 실제 청구한 회사의 환불 절차를 따로 확인하세요. 환불은 결제처와 구매 조건에 따라 달라집니다.
          </p>
        </>
      }
    >
      <SubscriptionFinder />
    </ToolPage>
  );
}
