"use client";

import { useEffect, useMemo, useState } from "react";

const DAY = 86_400_000;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => (s ? new Date(s + "T00:00:00") : null);
const DOW = ["일", "월", "화", "수", "목", "금", "토"];
const label = (d: Date) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DOW[d.getDay()]})`;
const diffDays = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY);   // 자정 기준이라 반올림
type Mode = "dday" | "between" | "add" | "age";

export default function DateTool() {
  // 날짜는 내 기기 기준이라 서버(UTC)와 다를 수 있어 화면에 붙은 뒤에 그린다
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [mode, setMode] = useState<Mode>("dday");
  const [target, setTarget] = useState(iso(new Date(today.getFullYear(), 11, 25)));
  const [from, setFrom] = useState(iso(today));
  const [to, setTo] = useState(iso(new Date(today.getTime() + 100 * DAY)));
  const [includeFirst, setIncludeFirst] = useState(false);
  const [base, setBase] = useState(iso(today));
  const [n, setN] = useState("100");
  const [birth, setBirth] = useState("1990-01-01");

  const out = useMemo(() => {
    if (mode === "dday") {
      const t = parse(target); if (!t) return null;
      const d = diffDays(today, t);
      return { big: d === 0 ? "D-DAY" : d > 0 ? `D-${d}` : `D+${-d}`,
               sub: `${label(t)}${d > 0 ? `까지 ${d}일 남았어요` : d < 0 ? `부터 ${-d}일 지났어요` : "이 오늘이에요"}` };
    }
    if (mode === "between") {
      const a = parse(from), b = parse(to); if (!a || !b) return null;
      const d = Math.abs(diffDays(a, b)) + (includeFirst ? 1 : 0);
      return { big: `${d.toLocaleString()}일`, sub: `약 ${Math.floor(d / 7)}주 ${d % 7}일 · ${(d / 30.44).toFixed(1)}개월 · ${(d / 365.25).toFixed(2)}년` };
    }
    if (mode === "add") {
      const b = parse(base); const k = Number(n) || 0; if (!b) return null;
      // 기념일(100일 등)은 시작일을 1일로 센다 → k-1 일 뒤
      const plain = new Date(b.getTime() + k * DAY);
      const anniv = new Date(b.getTime() + (k - 1) * DAY);
      return { big: label(includeFirst ? anniv : plain),
               sub: includeFirst ? `시작일을 1일로 셀 때 ${k}일째 (기념일 방식)` : `${label(b)}에서 ${k}일 ${k >= 0 ? "뒤" : "전"}` };
    }
    const bd = parse(birth); if (!bd) return null;
    let age = today.getFullYear() - bd.getFullYear();
    if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--;
    const next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
    if (next < today) next.setFullYear(today.getFullYear() + 1);
    const left = diffDays(today, next);
    return { big: `만 ${age}세`, sub: `연 나이 ${today.getFullYear() - bd.getFullYear()}세 · 다음 생일까지 ${left === 0 ? "오늘이 생일!" : `${left}일`} · 태어난 지 ${diffDays(bd, today).toLocaleString()}일` };
  }, [mode, target, from, to, includeFirst, base, n, birth, today]);

  const MODES: [Mode, string][] = [["dday", "D-day"], ["between", "날짜 사이 일수"], ["add", "며칠 뒤 날짜"], ["age", "만 나이"]];
  if (!ready) return <div className="tk-panel" style={{ minHeight: 320 }} aria-busy="true" />;
  return (
    <div className="tk-panel">
      <div className="tk-seg" style={{ marginBottom: 16 }}>
        {MODES.map(([m, l]) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{l}</button>)}
      </div>
      <div className="tk-row">
        {mode === "dday" && <label className="tk-field"><span>목표 날짜</span>
          <input type="date" className="tk-input" value={target} onChange={(e) => setTarget(e.target.value)} /></label>}
        {mode === "between" && <>
          <label className="tk-field"><span>시작일</span><input type="date" className="tk-input" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
          <label className="tk-field"><span>종료일</span><input type="date" className="tk-input" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        </>}
        {mode === "add" && <>
          <label className="tk-field"><span>기준일</span><input type="date" className="tk-input" value={base} onChange={(e) => setBase(e.target.value)} /></label>
          <label className="tk-field"><span>며칠 (빼려면 −)</span>
            <input className="tk-input" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value.replace(/[^\d-]/g, ""))} /></label>
        </>}
        {mode === "age" && <label className="tk-field"><span>생년월일</span>
          <input type="date" className="tk-input" value={birth} onChange={(e) => setBirth(e.target.value)} /></label>}
      </div>
      {(mode === "between" || mode === "add") && (
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, fontSize: 14 }}>
          <input type="checkbox" checked={includeFirst} onChange={(e) => setIncludeFirst(e.target.checked)} />
          시작일을 1일로 세기 (사귄 날·기념일 계산)
        </label>
      )}
      {out && (
        <div className="tk-stats">
          <div className="tk-stat main" style={{ gridColumn: "1 / -1" }}><b>{out.big}</b><span>{out.sub}</span></div>
        </div>
      )}
      {mode === "dday" && (
        <div className="tk-seg" style={{ marginTop: 12 }}>
          {[["크리스마스", `${today.getFullYear()}-12-25`], ["새해", `${today.getFullYear() + 1}-01-01`],
            ["수능(11월 셋째 목)", ""]].map(([l, d]) => {
            let v = d;
            if (!v) { const n1 = new Date(today.getFullYear(), 10, 1); const first = (4 - n1.getDay() + 7) % 7 + 1; v = iso(new Date(today.getFullYear(), 10, first + 14)); }
            return <button key={l} type="button" aria-pressed={target === v} onClick={() => setTarget(v)}>{l}</button>;
          })}
        </div>
      )}
    </div>
  );
}
