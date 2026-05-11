"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

declare global {
  interface Window {
    kakaoAdfitLoaded?: boolean;
  }
}

type AdFitAdProps = {
  adUnit?: string;
  width?: number;
  height?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export default function AdFitAd({
  adUnit = "DAN-BjHyHeIJGxfFhjVt",
  width = 728,
  height = 90,
  label = "Advertisement",
  className = "",
  style,
}: AdFitAdProps) {
  useEffect(() => {
    // SDK 중복 로드 방지
    if (window.kakaoAdfitLoaded) return;
    window.kakaoAdfitLoaded = true;
    const script = document.createElement("script");
    script.src = "//t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    document.head.appendChild(script);
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
        minHeight: `${height}px`,
        ...style,
      }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: "block" }}
        data-ad-unit={adUnit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
