"use client";

// 분류 탭 + 도구 카드 목록. 홈과 도구 목록 페이지가 같이 쓴다.
// 탭은 화면에서만 거르고, 처음 그릴 때는 전부 보여 준다(검색엔진이 모든 링크를 읽게).
import { useState } from "react";
import ToolCard from "../ToolCard";
import { CATALOG_SORTED, CATEGORIES, type Category } from "@/lib/catalog";

export default function CatalogGrid({ limit }: { limit?: number }) {
  const [cat, setCat] = useState<Category | "전체">("전체");
  const list = CATALOG_SORTED.filter((c) => cat === "전체" || c.category === cat);
  const shown = limit && cat === "전체" ? list.slice(0, limit) : list;
  return (
    <div>
      <div className="tk-tabs" role="tablist" aria-label="도구 분류">
        {(["전체", ...CATEGORIES] as const).map((c) => {
          const n = c === "전체" ? CATALOG_SORTED.length : CATALOG_SORTED.filter((x) => x.category === c).length;
          return (
            <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>
              {c} <span>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="tk-cards">
        {shown.map((item) => <ToolCard key={item.key} item={item} />)}
      </div>
    </div>
  );
}
