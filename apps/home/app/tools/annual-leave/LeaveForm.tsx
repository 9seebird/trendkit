"use client";

import { useEffect, useMemo, useState } from "react";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addMonths = (d: Date, m: number) => new Date(d.getFullYear(), d.getMonth() + m, d.getDate());
const addYears = (d: Date, y: number) => new Date(d.getFullYear() + y, d.getMonth(), d.getDate());

// 근로기준법 제60조: 1년 미만은 1개월 개근마다 1일(최대 11일), 1년 80% 이상 출근 시 15일,
// 3년 이상부터 2년마다 1일 가산, 최대 25일
export function leaveForYear(year: number) {        // year = 근속 n년차를 채운 시점 (1, 2, 3 …)
  return Math.min(25, 15 + Math.floor((year - 1) / 2));
}

export default function LeaveForm() {
  // 날짜는 내 기기 기준이라 서버(UTC)와 다를 수 있어 화면에 붙은 뒤에 그린다
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const today = new Date();
  const [start, setStart] = useState(iso(addYears(today, -2)));
  const [base, setBase] = useState(iso(today));

  const r = useMemo(() => {
    const s = start ? new Date(start + "T00:00:00") : null;
    const b = base ? new Date(base + "T00:00:00") : null;
    if (!s || !b || b < s) return null;
    let months = 0;
    while (addMonths(s, months + 1) <= b) months++;
    const years = Math.floor(months / 12);
    const firstYear = Math.min(11, months);              // 입사 첫해에 생긴 월차 (1년 되는 날까지)
    const current = years >= 1 ? leaveForYear(years) : firstYear;
    // 다음 발생: 1년 미만은 다음 달 개근일(11개월째 다음은 1년이 되는 날 15일), 1년 이상은 다음 입사 기념일
    const oneYear = years < 1 && months + 1 >= 12;
    const nextDate = years >= 1 || oneYear ? addYears(s, years + 1) : addMonths(s, months + 1);
    const nextDays = years >= 1 || oneYear ? leaveForYear(years + 1) : 1;
    return { months, years, firstYear, current, nextDate, nextDays };
  }, [start, base]);

  if (!ready) return <div className="tk-panel" style={{ minHeight: 320 }} aria-busy="true" />;
  return (
    <div className="tk-panel">
      <div className="tk-row">
        <label className="tk-field"><span>입사일</span>
          <input type="date" className="tk-input" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="tk-field"><span>기준일</span>
          <input type="date" className="tk-input" value={base} onChange={(e) => setBase(e.target.value)} />
          <small>보통 오늘 날짜</small></label>
      </div>
      {!r ? <p className="tk-note tk-warn">기준일이 입사일보다 뒤여야 해요.</p> : (
        <>
          <div className="tk-stats">
            <div className="tk-stat main"><b>{r.current}일</b>
              <span>{r.years >= 1 ? `${r.years}년 근속으로 생긴 연차` : `입사 ${r.months}개월 · 지금까지 생긴 연차`}</span></div>
            <div className="tk-stat"><b>{r.years}년 {r.months % 12}개월</b><span>근속 기간</span></div>
            <div className="tk-stat"><b>+{r.nextDays}일</b><span>{iso(r.nextDate)}에 새로 생김</span></div>
          </div>
          {r.years < 1 && (
            <p className="tk-note">입사 1년 미만은 한 달 개근할 때마다 1일씩 생겨 최대 11일입니다. 1년이 되는 날 15일이 새로 생겨요 (80% 이상 출근 시).</p>
          )}
          <table className="tk-table">
            <thead><tr><th>근속</th><th>발생일</th><th className="n">연차</th></tr></thead>
            <tbody>
              <tr><td>1년 미만</td><td>매달 개근 시</td><td className="n">최대 11일</td></tr>
              {Array.from({ length: 21 }, (_, i) => i + 1).map((y) => {
                const d = addYears(new Date(start + "T00:00:00"), y);
                const now = r.years === y;
                return (
                  <tr key={y} style={now ? { background: "var(--brand-light)", fontWeight: 700 } : undefined}>
                    <td>{y}년</td><td>{iso(d)}</td><td className="n">{leaveForYear(y)}일</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="tk-note">상시 근로자 5명 이상 사업장, 입사일 기준입니다. 회사가 회계연도(1월 1일) 기준으로 관리하면 첫해·둘째 해 일수가 다를 수 있어요.</p>
        </>
      )}
    </div>
  );
}
