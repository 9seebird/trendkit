"use client";

import { useMemo, useState } from "react";
import { calcSalary } from "@/lib/salary";

const won = (n: number) => `${Math.round(n).toLocaleString()}원`;
const num = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

export default function SalaryForm() {
  const [annual, setAnnual] = useState("40,000,000");
  const [unit, setUnit] = useState<"won" | "man">("won");
  const [sev, setSev] = useState(false);
  const [nonTax, setNonTax] = useState("200,000");
  const [family, setFamily] = useState(1);
  const [children, setChildren] = useState(0);

  const annualWon = unit === "man" ? num(annual) * 10_000 : num(annual);
  const r = useMemo(() => calcSalary({
    annual: annualWon, severanceIncluded: sev, nonTaxMonthly: num(nonTax), family, children,
  }), [annualWon, sev, nonTax, family, children]);

  const fmt = (v: string) => { const n = num(v); return n ? n.toLocaleString() : ""; };

  return (
    <div className="tk-panel">
      <div className="tk-row">
        <label className="tk-field">
          <span>연봉 (세전)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="tk-input" inputMode="numeric" value={annual}
                   onChange={(e) => setAnnual(fmt(e.target.value))} aria-label="연봉" />
            <select className="tk-select" style={{ width: 96 }} value={unit}
                    onChange={(e) => { const u = e.target.value as "won" | "man";
                      setAnnual((u === "man" ? Math.round(annualWon / 10_000) : annualWon).toLocaleString()); setUnit(u); }}>
              <option value="won">원</option><option value="man">만원</option>
            </select>
          </div>
          <small>{annualWon ? `${(annualWon / 10_000).toLocaleString()}만원` : "연봉을 입력하세요"}</small>
        </label>
        <label className="tk-field">
          <span>비과세액 (월)</span>
          <input className="tk-input" inputMode="numeric" value={nonTax} onChange={(e) => setNonTax(fmt(e.target.value))} />
          <small>식대는 월 20만 원까지 비과세. 모르면 그대로 두세요</small>
        </label>
      </div>
      <div className="tk-row" style={{ marginTop: 14 }}>
        <label className="tk-field">
          <span>부양가족 수 (본인 포함)</span>
          <select className="tk-select" value={family} onChange={(e) => setFamily(+e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}명</option>)}
          </select>
        </label>
        <label className="tk-field">
          <span>8~20세 자녀 수</span>
          <select className="tk-select" value={children} onChange={(e) => setChildren(+e.target.value)}>
            {Array.from({ length: 7 }, (_, i) => i).map((n) => <option key={n} value={n}>{n}명</option>)}
          </select>
        </label>
        <div className="tk-field">
          <span>퇴직금</span>
          <div className="tk-seg">
            <button type="button" aria-pressed={!sev} onClick={() => setSev(false)}>별도</button>
            <button type="button" aria-pressed={sev} onClick={() => setSev(true)}>연봉에 포함</button>
          </div>
        </div>
      </div>

      <div className="tk-stats">
        <div className="tk-stat main"><b>{won(r.net)}</b><span>월 예상 실수령액</span></div>
        <div className="tk-stat"><b>{won(r.netAnnual)}</b><span>연 실수령액</span></div>
        <div className="tk-stat"><b>{won(r.deductions)}</b><span>월 공제 합계 ({(r.deductionRate * 100).toFixed(1)}%)</span></div>
      </div>

      <table className="tk-table">
        <thead><tr><th>항목</th><th className="n">월 금액</th></tr></thead>
        <tbody>
          <tr><td>월 급여 (세전{sev ? ", 퇴직금 포함이라 13으로 나눔" : ""})</td><td className="n">{won(r.monthlyGross)}</td></tr>
          <tr><td>국민연금 (4.75%)</td><td className="n">−{won(r.pension)}</td></tr>
          <tr><td>건강보험 (3.595%)</td><td className="n">−{won(r.health)}</td></tr>
          <tr><td>장기요양보험 (건강보험료의 13.14%)</td><td className="n">−{won(r.ltc)}</td></tr>
          <tr><td>고용보험 (0.9%)</td><td className="n">−{won(r.employment)}</td></tr>
          <tr><td>근로소득세</td><td className="n">−{won(r.incomeTax)}</td></tr>
          <tr><td>지방소득세 (소득세의 10%)</td><td className="n">−{won(r.localTax)}</td></tr>
          <tr className="total"><td>실수령액</td><td className="n">{won(r.net)}</td></tr>
        </tbody>
      </table>
      <p className="tk-note">
        2026년 요율 기준 어림값입니다. 소득세는 1년치를 연말정산 방식으로 계산해 12로 나눈 값이라, 회사가 간이세액표로 매달 떼는 금액과
        조금 다를 수 있고 그 차이는 연말정산에서 정산됩니다. 입력값은 서버로 보내지 않아요.
      </p>
    </div>
  );
}
