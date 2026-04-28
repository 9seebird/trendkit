"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseAdProps = {
  slot?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

export default function AdSenseAd({
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID,
  label = "Advertisement",
  className = "",
  style,
}: AdSenseAdProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!client || !slot) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.warn("AdSense failed to initialize", error);
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <div
      className={`adsense-wrap ${className}`.trim()}
      aria-label={label}
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "24px auto",
        textAlign: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
