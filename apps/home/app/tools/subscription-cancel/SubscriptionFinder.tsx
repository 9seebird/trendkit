"use client";

import { useMemo, useState } from "react";
import {
  SUBSCRIPTION_BILLING_URLS,
  SUBSCRIPTION_GUIDES,
  type SubscriptionGuide,
} from "@/lib/subscription-guides";

type BillingRoute = "direct" | "apple" | "google-play" | "partner" | "unknown";
type Intent = "trial" | "cancel" | "charged";

const BILLING_OPTIONS: { id: BillingRoute; label: string }[] = [
  { id: "direct", label: "서비스에서 직접 결제" },
  { id: "apple", label: "Apple App Store" },
  { id: "google-play", label: "Google Play" },
  { id: "partner", label: "통신사·제휴사" },
  { id: "unknown", label: "잘 모르겠어요" },
];

const INTENTS: { id: Intent; label: string }[] = [
  { id: "trial", label: "무료 체험 중" },
  { id: "cancel", label: "앞으로 결제되지 않게 해지" },
  { id: "charged", label: "이미 결제됐어요" },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[\s._-]/g, "");
}

function findGuide(value: string): SubscriptionGuide | undefined {
  const query = normalize(value);
  if (!query) return undefined;
  return SUBSCRIPTION_GUIDES.find((guide) =>
    [guide.name, ...guide.aliases].some((alias) => {
      const normalizedAlias = normalize(alias);
      return query === normalizedAlias || query.includes(normalizedAlias);
    }),
  );
}

function serviceSearchActions(serviceName: string): { label: string; href: string }[] {
  const query = serviceName.trim();
  if (!query) return [];
  const search = `${query} 공식 고객센터 구독 해지 자동결제 취소`;
  return [{
    label: "웹에서 해지 안내 검색",
    href: `https://www.google.com/search?q=${encodeURIComponent(search)}`,
  }];
}

function routeDetails(route: BillingRoute, guide: SubscriptionGuide | undefined, serviceName: string) {
  if (route === "direct" && !guide) {
    return {
      title: "서비스 계정에서 구독을 관리하세요",
      description: "서비스 웹사이트나 앱의 계정·프로필에서 멤버십, 요금제, 구독 또는 결제 메뉴를 찾아보세요.",
      steps: [
        "가입 확인 이메일이나 카드 명세서에서 서비스의 정확한 이름을 확인합니다.",
        "서비스 계정의 결제 또는 멤버십 메뉴에서 다음 결제일과 해지 옵션을 찾습니다.",
        "취소 확인 화면까지 진행하고 갱신 중지 상태를 확인합니다.",
      ],
      actions: serviceSearchActions(serviceName),
    };
  }

  if (route === "apple") {
    return {
      title: "Apple 계정에서 구독을 관리하세요",
      description: "App Store로 가입했다면 iPhone 설정 또는 Apple 계정의 구독 목록에서 취소합니다.",
      steps: [
        "구독에 사용한 Apple 계정으로 로그인합니다.",
        "구독 목록에서 서비스를 선택하고 구독 취소를 누릅니다.",
        "화면에 표시되는 만료일이나 갱신 중지 상태를 확인합니다.",
      ],
      actions: [
        { label: "Apple 구독 관리 열기", href: SUBSCRIPTION_BILLING_URLS.apple },
        { label: "Apple 취소 안내", href: SUBSCRIPTION_BILLING_URLS.appleHelp },
      ],
    };
  }

  if (route === "google-play") {
    return {
      title: "Google Play에서 구독을 관리하세요",
      description: "가입할 때 사용한 Google 계정으로 로그인해야 해당 구독이 표시됩니다.",
      steps: [
        "Google Play 구독 목록을 열고 구매에 사용한 Google 계정으로 로그인합니다.",
        "서비스를 선택하고 정기 결제 취소를 진행합니다.",
        "취소 완료와 다음 결제 중지 상태를 확인합니다.",
      ],
      actions: [
        { label: "Google Play 구독 관리 열기", href: SUBSCRIPTION_BILLING_URLS.googlePlay },
        { label: "Google Play 취소 안내", href: SUBSCRIPTION_BILLING_URLS.googlePlayHelp },
      ],
    };
  }

  if (route === "partner") {
    return {
      title: "청구한 통신사나 제휴사에서 해지하세요",
      description: guide?.partnerNote ?? "통신사 앱·웹사이트의 부가서비스 또는 구독 관리 메뉴에서 해당 서비스를 찾아 해지합니다.",
      steps: [
        "카드·통신 요금 명세서에서 실제 청구 회사를 확인합니다.",
        "그 회사의 앱이나 웹사이트에서 부가서비스·구독 메뉴를 엽니다.",
        "해지 완료 화면이나 확인 문자를 보관하고 다음 청구가 중지됐는지 확인합니다.",
      ],
      actions: guide
        ? [{ label: guide.helpLabel, href: guide.helpUrl }]
        : serviceSearchActions(serviceName),
    };
  }

  if (route === "unknown") {
    return {
      title: "먼저 실제 결제처를 확인하세요",
      description: "가입 확인 이메일과 카드·통신 요금 명세서에서 청구 회사 이름을 확인하면 해지할 곳을 찾을 수 있습니다.",
      steps: [
        "메일에서 서비스 이름과 ‘영수증’, ‘구독’, ‘결제’를 검색합니다.",
        "Apple 또는 Google Play 구독 목록에서 해당 서비스가 보이는지 확인합니다.",
        "두 곳에 없으면 카드 명세서에 적힌 회사나 서비스 계정의 결제 메뉴를 확인합니다.",
      ],
      actions: [
        { label: "Apple 구독 목록", href: SUBSCRIPTION_BILLING_URLS.apple },
        { label: "Google Play 구독 목록", href: SUBSCRIPTION_BILLING_URLS.googlePlay },
        ...(guide ? [{ label: `${guide.name} 공식 안내`, href: guide.helpUrl }] : []),
        ...(!guide ? serviceSearchActions(serviceName) : []),
      ],
    };
  }

  if (guide) {
    return {
      title: `${guide.name} 계정에서 구독을 관리하세요`,
      description: "계정 페이지에서 다음 결제일과 갱신 상태를 확인하고, 취소 절차가 끝날 때까지 진행하세요.",
      steps: guide.directSteps,
      actions: [
        { label: `${guide.name} 계정 열기`, href: guide.manageUrl },
        { label: guide.helpLabel, href: guide.helpUrl },
      ],
    };
  }

  return {
    title: "서비스 계정의 결제 메뉴를 확인하세요",
    description: "서비스 이름을 입력하면 공식 안내가 등록된 경우 서비스별 경로를 보여 줍니다. 목록에 없는 서비스는 계정의 멤버십·요금제·결제 메뉴에서 해지 경로를 찾으세요.",
    steps: [
      "서비스 웹사이트나 앱에 로그인합니다.",
      "계정·프로필에서 멤버십, 요금제, 구독 또는 결제 메뉴를 엽니다.",
      "해지 확인 화면까지 진행한 뒤 다음 결제 중지 상태를 확인합니다.",
    ],
    actions: serviceSearchActions(serviceName),
  };
}

export default function SubscriptionFinder() {
  const [serviceName, setServiceName] = useState("");
  const [route, setRoute] = useState<BillingRoute>("unknown");
  const [intent, setIntent] = useState<Intent>("cancel");
  const guide = useMemo(() => findGuide(serviceName), [serviceName]);
  const details = routeDetails(route, guide, serviceName);
  const displayService = guide?.name ?? (serviceName.trim() || "서비스");
  const title = intent === "trial"
    ? `${displayService} 무료 체험 확인`
    : intent === "charged"
      ? `${displayService} 해지와 환불 확인`
      : `${displayService} 해지 경로`;

  return (
    <div className="tk-panel sc-panel">
      <label className="tk-field" htmlFor="subscription-service">
        <span>서비스 이름</span>
        <input
          id="subscription-service"
          className="tk-input"
          list="subscription-service-list"
          value={serviceName}
          onChange={(event) => setServiceName(event.target.value)}
          placeholder="예: 티빙, Apple Music, Disney+, ChatGPT"
          autoComplete="off"
        />
        <datalist id="subscription-service-list">
          {SUBSCRIPTION_GUIDES.map((item) => <option key={item.id} value={item.name} />)}
        </datalist>
      </label>
      <p className="tk-note sc-service-note">
        서비스 이름만 입력해 주세요. 등록된 서비스는 서비스별 안내를 보여드리고, 목록에 없는 이름은 웹 검색으로 연결합니다. 검색 결과에서 공식 서비스나 실제 결제처의 안내인지 확인해 주세요.
      </p>

      <fieldset className="sc-fieldset">
        <legend>어떤 상황인가요?</legend>
        <div className="sc-intents">
          {INTENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={intent === item.id}
              onClick={() => setIntent(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="sc-fieldset">
        <legend>어디서 결제했나요?</legend>
        <div className="sc-routes">
          {BILLING_OPTIONS.map((item) => (
            <label className={route === item.id ? "selected" : ""} key={item.id}>
              <input
                type="radio"
                name="billing-route"
                value={item.id}
                checked={route === item.id}
                onChange={() => setRoute(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="sc-result" aria-live="polite" aria-atomic="true">
        <p className="sc-result-kicker">안내 경로</p>
        <h2>{title}</h2>
        {intent === "trial" && (
          <p className="sc-trial-note">
            {guide?.trialNote ?? "무료 체험의 종료일과 종료 후 요금은 가입 당시 표시된 조건을 확인하세요. 서비스 계정의 구독 화면에서 다음 결제일과 갱신 상태를 볼 수 있습니다."}
          </p>
        )}
        <h3>{details.title}</h3>
        <p>{details.description}</p>
        <ol>
          {details.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>

        {intent === "charged" && (
          <div className="sc-refund-note">
            이미 빠져나간 결제의 환불은 구독 취소와 별도 절차입니다. 환불 가능 여부는 결제처에서 확인하세요.
          </div>
        )}

        <div className="sc-actions">
          {details.actions.map((action) => (
            <a key={action.href} className="tk-btn" href={action.href} target="_blank" rel="noreferrer">
              {action.label}
            </a>
          ))}
          {intent === "charged" && route === "apple" && (
            <a className="tk-btn ghost" href={SUBSCRIPTION_BILLING_URLS.appleRefund} target="_blank" rel="noreferrer">
              Apple 환불 요청
            </a>
          )}
          {intent === "charged" && route === "google-play" && (
            <a className="tk-btn ghost" href={SUBSCRIPTION_BILLING_URLS.googlePlayRefund} target="_blank" rel="noreferrer">
              Google Play 환불 안내
            </a>
          )}
        </div>
        <p className="tk-note">로그인 후 취소를 완료하고, 결제처 계정에서 갱신 중지 상태를 확인하세요. 이 도구는 계정에 접속하거나 취소를 대신 수행하지 않습니다.</p>
      </section>
    </div>
  );
}
