"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

// 카카오 애드핏 광고단위 (매체: excel-trendkit / excel.trendkit.app)
export const ADFIT_UNITS = {
  pc: { unit: "DAN-06FCZznWHbGDHK6O", width: 728, height: 90 },
  mobile: { unit: "DAN-8EwMqpWPAz6UOaz0", width: 320, height: 100 },
};

type AdFitAdProps = {
  label?: string;
  className?: string;
  style?: CSSProperties;
};

// 광고 칸(<ins>)은 서버가 그린 HTML 에 PC 단위로 바로 넣는다 — 애드핏 매체 심사가 설치를 알아볼 수 있게.
// 폰이면 애드핏 스크립트를 불러오기 전에 같은 칸을 모바일 단위로 바꾼다.
// (스크립트를 <head> 에서 먼저 불러오면 바꾸기 전에 PC 단위로 채워 버리므로 여기서만 불러온다)
export default function AdFitAd({ label = "Advertisement", className = "", style }: AdFitAdProps) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = ref.current;
    if (!ins) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      const m = ADFIT_UNITS.mobile;
      ins.setAttribute("data-ad-unit", m.unit);
      ins.setAttribute("data-ad-width", String(m.width));
      ins.setAttribute("data-ad-height", String(m.height));
    }
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      className={`adfit-wrap ${className}`.trim()}
      aria-label={label}
      style={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        minHeight: "90px",
        ...style,
      }}
    >
      <ins
        ref={ref}
        className="kakao_ad_area"
        style={{ display: "block", maxWidth: "100%" }}
        data-ad-unit={ADFIT_UNITS.pc.unit}
        data-ad-width={String(ADFIT_UNITS.pc.width)}
        data-ad-height={String(ADFIT_UNITS.pc.height)}
      />
    </div>
  );
}
