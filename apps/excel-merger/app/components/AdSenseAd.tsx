"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

// 카카오 애드핏 광고단위 (매체: trendkit / trendkit.app)
export const ADFIT_UNITS = {
  pc: { unit: "DAN-jOpDNz4ve9XF9oWQ", width: 728, height: 90 },
  mobile: { unit: "DAN-TcVxmySMIFIuin4t", width: 320, height: 100 },
};

type AdFitAdProps = {
  label?: string;
  className?: string;
  style?: CSSProperties;
};

// 애드핏 스크립트는 로드될 때 화면에 있는 광고 칸을 채우므로,
// 화면 크기에 맞는 칸 하나를 먼저 만든 뒤 스크립트를 불러옵니다.
export default function AdFitAd({ label = "Advertisement", className = "", style }: AdFitAdProps) {
  const [ad, setAd] = useState<(typeof ADFIT_UNITS)["pc"] | null>(null);

  useEffect(() => {
    setAd(window.matchMedia("(max-width: 767px)").matches ? ADFIT_UNITS.mobile : ADFIT_UNITS.pc);
  }, []);

  useEffect(() => {
    if (!ad) return;
    const script = document.createElement("script");
    script.src = "//t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [ad]);

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
        minHeight: `${ad ? ad.height : 90}px`,
        ...style,
      }}
    >
      {ad && (
        <ins
          className="kakao_ad_area"
          style={{ display: "block" }}
          data-ad-unit={ad.unit}
          data-ad-width={String(ad.width)}
          data-ad-height={String(ad.height)}
        />
      )}
    </div>
  );
}
