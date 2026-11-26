export type SubscriptionGuide = {
  id: string;
  name: string;
  aliases: string[];
  manageUrl: string;
  helpUrl: string;
  helpLabel: string;
  directSteps: string[];
  partnerNote?: string;
  trialNote?: string;
};

export const SUBSCRIPTION_GUIDES: SubscriptionGuide[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    aliases: ["챗GPT", "챗지피티", "OpenAI", "ChatGPT Plus", "ChatGPT Pro"],
    manageUrl: "https://chatgpt.com/",
    helpUrl: "https://help.openai.com/en/articles/7232927-canceling-your-chatgpt-subscription",
    helpLabel: "OpenAI 구독 취소 안내",
    directSteps: [
      "ChatGPT에 로그인하고 계정 메뉴에서 설정을 엽니다.",
      "결제(Billing)에서 요금제 취소(Cancel plan)를 선택합니다.",
      "다음 결제일 최소 24시간 전에 취소하고, 결제 설정에서 갱신 중지 상태를 확인합니다.",
    ],
    trialNote: "무료 체험이나 할인 오퍼는 계정과 가입 시점에 따라 다를 수 있습니다. 가입 확인 화면이나 이메일에 적힌 체험 종료일과 이후 결제 조건을 확인하세요.",
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    aliases: ["유튜브 프리미엄", "유튜브뮤직", "YouTube", "YouTube Music Premium", "유튜브 뮤직 프리미엄"],
    manageUrl: "https://www.youtube.com/paid_memberships",
    helpUrl: "https://support.google.com/youtube/answer/10324204?hl=ko",
    helpLabel: "YouTube 무료 체험 안내",
    directSteps: [
      "YouTube 유료 멤버십 페이지에서 해당 멤버십의 관리를 엽니다.",
      "비활성화 또는 취소를 선택하고 안내에 따라 취소를 완료합니다.",
      "멤버십 페이지의 상태가 취소로 바뀌었는지 확인합니다.",
    ],
    trialNote: "YouTube Premium 무료 체험은 체험이 끝날 때까지 취소하지 않으면 등록한 결제 수단으로 현재 멤버십 가격이 자동 청구됩니다. 체험 기간과 제공 여부는 계정별로 다를 수 있어요.",
  },
  {
    id: "netflix",
    name: "Netflix",
    aliases: ["넷플릭스"],
    manageUrl: "https://www.netflix.com/cancelplan",
    helpUrl: "https://help.netflix.com/ko/node/407",
    helpLabel: "Netflix 멤버십 해지 안내",
    directSteps: [
      "Netflix 계정의 멤버십 관리 화면을 엽니다.",
      "멤버십 해지를 선택한 다음 해지 완료까지 진행합니다.",
      "계정 화면이나 확인 이메일에서 해지 상태와 이용 종료일을 확인합니다.",
    ],
    partnerNote: "계정에 해지 옵션이 없다면 통신사나 제휴 결제처를 통해 가입했을 수 있습니다. Netflix 계정의 멤버십 섹션에서 표시되는 결제 파트너 안내를 확인하세요.",
    trialNote: "체험이나 프로모션 조건은 가입 당시 계정 화면과 확인 이메일에 표시된 내용을 확인하세요. 이 안내 도구는 계정별 오퍼나 다음 청구일을 조회하지 않습니다.",
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    aliases: ["스포티파이", "Spotify"],
    manageUrl: "https://www.spotify.com/account/overview/",
    helpUrl: "https://support.spotify.com/kr-ko/article/cancel-premium/",
    helpLabel: "Spotify Premium 해지 안내",
    directSteps: [
      "Spotify 계정 페이지에서 요금제와 결제 정보를 확인합니다.",
      "Premium 요금제 관리 화면에서 해지를 선택하고 확인 절차를 마칩니다.",
      "계정 페이지에서 요금제가 무료로 전환되거나 다음 결제가 중지됐는지 확인합니다.",
    ],
    partnerNote: "Spotify 계정 페이지에 결제 정보나 해지 옵션이 없다면 통신사 또는 제휴사를 통해 결제 중인지 확인하고, 해당 결제처에서 해지하세요.",
    trialNote: "체험과 프로모션 조건은 계정별로 다를 수 있습니다. Spotify 계정의 요금제 화면에서 다음 결제일과 요금제 상태를 확인하세요.",
  },
];

export const SUBSCRIPTION_BILLING_URLS = {
  apple: "https://account.apple.com/account/manage/section/subscriptions",
  appleHelp: "https://support.apple.com/ko-kr/118428",
  appleRefund: "https://reportaproblem.apple.com/",
  googlePlay: "https://play.google.com/store/account/subscriptions",
  googlePlayHelp: "https://support.google.com/googleplay/answer/7018481?hl=ko",
  googlePlayRefund: "https://support.google.com/googleplay/workflow/9813244?hl=ko",
} as const;
