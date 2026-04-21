"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "About",   href: "/about"    },
  { label: "Service", href: "/services" },
  { label: "Contact", href: "/contact"  },
];

export default function Header() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 라우트 이동 시 메뉴 닫기
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const hasBg = scrolled || menuOpen;

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "var(--nav-height)", zIndex: 100,
        background: hasBg ? "rgba(245,244,240,0.96)" : "transparent",
        backdropFilter: hasBg ? "blur(16px)" : "none",
        borderBottom: hasBg ? "1px solid var(--border)" : "1px solid transparent",
        transition: "background 0.3s, border-color 0.3s",
        /* 로고 ↔ nav ↔ 햄버거 정렬 */
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 48px)",
        gap: "16px",
      }}>

        {/* 로고 */}
        <Link href="/" style={{
          fontWeight: 900,
          fontSize: "clamp(19px, 2.5vw, 24px)",
          color: "var(--text-primary)",
          textDecoration: "none",
          letterSpacing: "-0.5px",
          flexShrink: 0,
        }}>
          TrendKit
        </Link>

        {/* 데스크탑 nav */}
        <nav className="desktop-nav" style={{
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.label} href={item.href} style={{
                padding: "8px 16px",
                fontSize: "15px",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                transition: "all 0.15s",
                /* 터치 영역 확보 */
                minHeight: "40px",
                display: "flex", alignItems: "center",
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 햄버거 (모바일만) */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* 모바일 드로어 */}
      <nav className={`mobile-nav${menuOpen ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={isActive ? "active" : ""}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 딤 배경 */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 98,
            background: "rgba(0,0,0,0.25)",
          }}
        />
      )}
    </>
  );
}
