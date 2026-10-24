// 모든 화면(홈·도구 목록·관련 도구)이 같이 쓰는 도구 카드 하나
import Link from "next/link";
import type { CatalogItem } from "@/lib/catalog";

export default function ToolCard({ item, compact = false }: { item: CatalogItem; compact?: boolean }) {
  return (
    <Link
      href={item.href}
      className={`tk-card${compact ? " compact" : ""}`}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      <span className="ic" style={{ background: item.iconBg }} aria-hidden="true">{item.icon}</span>
      <span className="tx">
        <b>{item.name}{item.external && <span className="ext" aria-label="새 창">↗</span>}</b>
        <small>{item.short}</small>
        {!compact && <em className="cat">{item.category}</em>}
      </span>
    </Link>
  );
}
