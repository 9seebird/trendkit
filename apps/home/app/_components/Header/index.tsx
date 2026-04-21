"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────
// 네비게이션 메뉴 구조
// 메뉴 추가·수정 시 이 배열만 편집하세요.
// ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "About",   href: "/about"    },
  { label: "Service", href: "/services" },
  { label: "Contact", href: "/contact"  },
];

export default function Header() {
  const pathname = usePathname();           // 현재 경로 감지 → 활성 메뉴 판단
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지: 20px 이상 내려가면 배경 블러 처리
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "var(--nav-height)",
        zIndex: 100,
        background: scrolled ? "rgba(245,244,240,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.3s",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "0 48px",
      }}
    >
      {/* ── 로고 ── */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 900,
          fontSize: "26px",
          color: "var(--text-primary)",
          textDecoration: "none",
          letterSpacing: "-0.5px",
        }}
      >
        TrendKit
      </Link>

      {/* ── 네비게이션 ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {NAV_ITEMS.map((item) => {
          // 현재 경로와 일치하면 active 처리
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                fontSize: "16px",
                // ★ 현재 페이지 메뉴: 굵은 글씨 + 진한 색상 + 배경 강조
                fontWeight: isActive ? 700 : 500,
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── 우측 여백 (로그인 버튼 등 추가 시 여기에) ── */}
      <div />
    </header>
  );
}
