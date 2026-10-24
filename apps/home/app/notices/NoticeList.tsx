"use client";

import { useState } from "react";
import { useNotices } from "../_components/notices";

const PAGE = 10;

export default function NoticeList() {
  const notices = useNotices();
  const tags = ["전체", ...Array.from(new Set(notices.map((n) => n.tag)))];
  const [tag, setTag] = useState("전체");
  const [count, setCount] = useState(PAGE);
  const list = notices.filter((n) => tag === "전체" || n.tag === tag);
  return (
    <>
      <div className="tk-tabs" role="tablist" aria-label="공지 분류">
        {tags.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tag === t} onClick={() => { setTag(t); setCount(PAGE); }}>
            {t} <span>{t === "전체" ? notices.length : notices.filter((n) => n.tag === t).length}</span>
          </button>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {list.slice(0, count).map((n, i) => (
          <article key={n.id} style={{ display: "flex", gap: 12, padding: "18px 20px", borderTop: i ? "1px solid var(--border)" : "none" }}>
            <span className="badge" style={{ background: n.tagColor, color: n.tagText, flexShrink: 0, height: "fit-content", marginTop: 2 }}>{n.tag}</span>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 15.5, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>{n.title}</h2>
              {n.content && <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "6px 0 0", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{n.content}</p>}
              <time style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)", marginTop: 6 }}>{n.date}</time>
            </div>
          </article>
        ))}
      </div>
      {list.length > count && (
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button type="button" className="btn btn-outline" onClick={() => setCount((c) => c + PAGE)}>
            더 보기 ({list.length - count})
          </button>
        </div>
      )}
    </>
  );
}
