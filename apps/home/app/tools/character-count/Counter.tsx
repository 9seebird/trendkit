"use client";

import { useMemo, useState } from "react";

// 한글 1자 = UTF-8 3바이트, EUC-KR(완성형) 2바이트. 문자·우편 등 옛 시스템은 EUC-KR 기준이 많다.
function bytesUtf8(s: string) { return new TextEncoder().encode(s).length; }
function bytesEuckr(s: string) {
  let n = 0;
  for (const ch of s) n += ch.charCodeAt(0) > 0x7f ? 2 : (ch === "\n" ? 2 : 1);   // 줄바꿈은 CRLF 로 2바이트
  return n;
}
const LIMITS = [500, 700, 1000, 1500, 2000];

export default function Counter() {
  const [text, setText] = useState("");
  const [limit, setLimit] = useState<number | null>(1000);
  const [custom, setCustom] = useState("");
  const s = useMemo(() => {
    const chars = [...text].length;
    const noSpace = [...text.replace(/\s/g, "")].length;
    const noSpaceNoLine = [...text.replace(/[ \t]/g, "")].length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const paras = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    return {
      chars, noSpace, noSpaceNoLine, words, lines, paras,
      utf8: bytesUtf8(text), euckr: bytesEuckr(text),
      sheets: Math.ceil(chars / 200),                 // 200자 원고지 (어림)
      readMin: Math.max(text ? 1 : 0, Math.round(noSpace / 500)),   // 한국어 분당 약 500자
    };
  }, [text]);
  const target = limit ?? (Number(custom) || null);
  const pct = target ? Math.min(100, (s.chars / target) * 100) : 0;

  return (
    <div className="tk-panel">
      <textarea
        className="tk-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="여기에 글을 붙여 넣거나 입력하세요. 자기소개서·리포트·블로그 글 모두 됩니다."
        aria-label="글자 수를 셀 글"
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 14 }}>
        <span className="tk-label">목표 글자 수</span>
        <div className="tk-seg">
          {LIMITS.map((l) => (
            <button key={l} type="button" aria-pressed={limit === l} onClick={() => setLimit(l)}>{l.toLocaleString()}자</button>
          ))}
          <button type="button" aria-pressed={limit === null} onClick={() => setLimit(null)}>직접</button>
        </div>
        {limit === null && (
          <input className="tk-input" style={{ width: 120 }} inputMode="numeric" placeholder="예: 800"
                 value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} aria-label="목표 글자 수" />
        )}
        <button type="button" className="tk-btn ghost" style={{ marginLeft: "auto" }} onClick={() => setText("")} disabled={!text}>지우기</button>
      </div>
      {target ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13.5 }}>
            공백 포함 <b>{s.chars.toLocaleString()}</b> / {target.toLocaleString()}자
            {s.chars > target
              ? <span className="tk-warn"> · {(s.chars - target).toLocaleString()}자 초과</span>
              : <span style={{ color: "var(--text-muted)" }}> · {(target - s.chars).toLocaleString()}자 남음</span>}
          </div>
          <div className="tk-progress"><i className={s.chars > target ? "over" : ""} style={{ width: `${pct}%` }} /></div>
        </div>
      ) : null}
      <div className="tk-stats">
        <div className="tk-stat main"><b>{s.chars.toLocaleString()}</b><span>공백 포함 글자</span></div>
        <div className="tk-stat main"><b>{s.noSpace.toLocaleString()}</b><span>공백 제외 글자</span></div>
        <div className="tk-stat"><b>{s.utf8.toLocaleString()}</b><span>바이트 (UTF-8, 한글 3)</span></div>
        <div className="tk-stat"><b>{s.euckr.toLocaleString()}</b><span>바이트 (EUC-KR, 한글 2)</span></div>
        <div className="tk-stat"><b>{s.words.toLocaleString()}</b><span>단어</span></div>
        <div className="tk-stat"><b>{s.lines.toLocaleString()}</b><span>줄 · 문단 {s.paras}</span></div>
        <div className="tk-stat"><b>{s.sheets.toLocaleString()}</b><span>원고지 매수 (200자)</span></div>
        <div className="tk-stat"><b>{s.readMin}분</b><span>읽는 시간 (어림)</span></div>
      </div>
      <p className="tk-note">입력한 글은 이 브라우저 안에서만 셉니다. 서버로 보내거나 저장하지 않아요.</p>
    </div>
  );
}
