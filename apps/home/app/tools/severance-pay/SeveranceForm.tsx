"use client";

import { useEffect, useMemo, useState } from "react";

const DAY = 86_400_000;
const num = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;
const fmt = (v: string) => { const n = num(v); return n ? n.toLocaleString() : ""; };
const parse = (s: string) => (s ? new Date(s + "T00:00:00") : null);
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function SeveranceForm() {
  // 날짜는 내 기기 기준이라 서버(UTC)와 다를 수 있어 화면에 붙은 뒤에 그린다
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const today = new Date();
  const [start, setStart] = useState(iso(new Date(today.getFullYear() - 3, today.getMonth(), today.getDate())));
  const [end, setEnd] = useState(iso(today));
  const [monthly, setMonthly] = useState("3,500,000");
  const [bonus, setBonus] = useState("0");
  const [leavePay, setLeavePay] = useState("0");

  const r = useMemo(() => {
    const s = parse(start), e = parse(end);
    if (!s || !e || e <= s) return null;
    // 퇴직일 = 마지막 근무일의 다음 날. 재직일수는 입사일부터 마지막 근무일까지
    const lastDay = new Date(e.getTime());
    const days = Math.round((lastDay.getTime() - s.getTime()) / DAY) + 1;
    // 평균임금 산정기간: 퇴직일 이전 3개월 (달력 일수)
    const from = new Date(e.getFullYear(), e.getMonth() - 3, e.getDate() + 1);
    const periodDays = Math.round((e.getTime() - from.getTime()) / DAY) + 1;
    const wages3 = num(monthly) * 3;
    const extra = num(bonus) * 3 / 12 + num(leavePay) * 3 / 12;
    const avgDaily = (wages3 + extra) / periodDays;
    const pay = avgDaily * 30 * (days / 365);
    return { days, years: days / 365, periodDays, wages3, extra, avgDaily, pay, eligible: days >= 365 };
  }, [start, end, monthly, bonus, leavePay]);

  if (!ready) return <div className="tk-panel" style={{ minHeight: 320 }} aria-busy="true" />;
  return (
    <div className="tk-panel">
      <div className="tk-row">
        <label className="tk-field"><span>입사일</span>
          <input type="date" className="tk-input" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="tk-field"><span>마지막 근무일</span>
          <input type="date" className="tk-input" value={end} onChange={(e) => setEnd(e.target.value)} />
          <small>퇴사 처리일이 아니라 실제로 마지막 출근한 날</small></label>
      </div>
      <div className="tk-row" style={{ marginTop: 14 }}>
        <label className="tk-field"><span>최근 3개월 월 평균 급여 (세전)</span>
          <input className="tk-input" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(fmt(e.target.value))} />
          <small>기본급 + 고정 수당 + 연장근로수당 (비과세 식대 포함)</small></label>
        <label className="tk-field"><span>최근 1년 상여금 합계</span>
          <input className="tk-input" inputMode="numeric" value={bonus} onChange={(e) => setBonus(fmt(e.target.value))} /></label>
        <label className="tk-field"><span>최근 1년 연차수당</span>
          <input className="tk-input" inputMode="numeric" value={leavePay} onChange={(e) => setLeavePay(fmt(e.target.value))} /></label>
      </div>
      {!r ? (
        <p className="tk-note tk-warn">마지막 근무일이 입사일보다 뒤여야 해요.</p>
      ) : (
        <>
          <div className="tk-stats">
            <div className="tk-stat main"><b>{r.eligible ? `${Math.round(r.pay).toLocaleString()}원` : "대상 아님"}</b><span>예상 퇴직금 (세전)</span></div>
            <div className="tk-stat"><b>{r.days.toLocaleString()}일</b><span>재직일수 · 약 {r.years.toFixed(1)}년</span></div>
            <div className="tk-stat"><b>{Math.round(r.avgDaily).toLocaleString()}원</b><span>1일 평균임금</span></div>
          </div>
          {!r.eligible && <p className="tk-note tk-warn">재직 기간이 1년 미만이면 법정 퇴직금 대상이 아니에요 (주 15시간 이상, 1년 이상 근무).</p>}
          <table className="tk-table">
            <tbody>
              <tr><td>최근 3개월 임금 총액</td><td className="n">{r.wages3.toLocaleString()}원</td></tr>
              <tr><td>상여금·연차수당 가산 (각 3/12)</td><td className="n">{Math.round(r.extra).toLocaleString()}원</td></tr>
              <tr><td>평균임금 산정 기간</td><td className="n">{r.periodDays}일</td></tr>
              <tr><td>1일 평균임금</td><td className="n">{Math.round(r.avgDaily).toLocaleString()}원</td></tr>
              <tr className="total"><td>퇴직금 = 1일 평균임금 × 30일 × 재직일수 ÷ 365</td><td className="n">{Math.round(r.pay).toLocaleString()}원</td></tr>
            </tbody>
          </table>
          <p className="tk-note">세금(퇴직소득세)을 떼기 전 금액입니다. 1일 평균임금이 통상임금보다 적으면 통상임금으로 계산하는 등 실제 금액은 회사 산정과 다를 수 있어요.</p>
        </>
      )}
    </div>
  );
}
