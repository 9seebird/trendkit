"use client";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────
// BackButton 공통 컴포넌트
// 서브페이지 상단에 넣으면 브라우저 히스토리 기반 뒤로가기
// 히스토리가 없으면 홈(/)으로 이동
// ─────────────────────────────────────────────────────

interface BackButtonProps {
  label?: string;   // 버튼 텍스트 (기본: "← 뒤로")
  fallback?: string; // 히스토리 없을 때 이동할 경로 (기본: "/")
}

export default function BackButton({
  label = "← 뒤로",
  fallback = "/",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // 히스토리가 있으면 뒤로, 없으면 fallback 경로로
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: 500,
        color: "var(--text-secondary)",
        background: "var(--bg-surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        transition: "all 0.15s",
        marginBottom: "24px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
      }}
    >
      {label}
    </button>
  );
}
