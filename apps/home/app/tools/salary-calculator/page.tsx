import type { Metadata } from "next";
import ToolPage, { toolMetadata } from "../_components/ToolPage";
import SalaryForm from "./SalaryForm";
import { calcSalary, RATES } from "@/lib/salary";

const SLUG = "salary-calculator";
export const metadata: Metadata = toolMetadata(
  SLUG,
  "2026 연봉 실수령액 계산기 — 4대보험·소득세 공제 후 월급",
  "2026년 국민연금 4.75%·건강보험 3.595% 등 최신 요율로 연봉 실수령액을 계산합니다. 연봉 2,000만~1억 원 실수령액 표, 공제 항목별 금액, 부양가족·비과세 반영.",
);

// 연봉별 실수령액 표 — 서버에서 미리 계산해 본문에 넣는다 (검색으로 들어온 사람이 바로 보게)
const TABLE = Array.from({ length: 17 }, (_, i) => 20_000_000 + i * 5_000_000).map((annual) => ({
  annual, ...calcSalary({ annual, nonTaxMonthly: 200_000, family: 1, children: 0 }),
}));
const man = (n: number) => `${(n / 10_000).toLocaleString()}만`;

const FAQ = [
  { q: "실수령액이 실제 월급과 조금 다른데 왜 그런가요?",
    a: "소득세 때문입니다. 회사는 국세청 간이세액표로 매달 소득세를 떼고, 이 계산기는 1년치 세금을 연말정산 방식으로 계산해 12로 나눕니다. 그 차이는 다음 해 연말정산에서 돌려받거나 더 냅니다. 또 4대보험은 실제 보수월액(전년도 소득 기준)으로 정해져 입사 첫해에는 다를 수 있습니다." },
  { q: "2026년에 국민연금이 왜 올랐나요?",
    a: "연금개혁으로 국민연금 보험료율이 2026년부터 매년 0.5%포인트씩 올라 2033년 13%가 됩니다. 2026년 보험료율은 9.5%이고, 회사와 근로자가 절반씩(4.75%) 냅니다." },
  { q: "비과세액은 무엇을 넣으면 되나요?",
    a: "급여명세서에서 식대(월 20만 원 한도), 자가운전보조금(월 20만 원 한도), 출산·보육수당(월 20만 원 한도) 같은 비과세 항목을 더해 넣으세요. 모르면 식대 20만 원만 두면 대부분 비슷합니다." },
  { q: "연봉에 퇴직금이 포함되어 있으면 어떻게 하나요?",
    a: "'연봉에 포함'을 고르면 연봉을 13으로 나눠 월 급여를 계산합니다. 퇴직금 1/13이 매달 월급에서 빠지는 셈이라 실수령액이 줄어듭니다." },
];

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      lead={`${RATES.year}년 4대보험 요율과 소득세를 반영해 연봉에서 매달 실제로 받는 금액을 계산합니다. 공제 항목별 금액도 한눈에 보여 드려요.`}
      faq={FAQ}
      related={["severance-pay", "annual-leave", "date-calculator"]}
      article={
        <>
          <h2>2026년 연봉별 실수령액 표</h2>
          <p>비과세 식대 월 20만 원, 부양가족 본인 1명, 퇴직금 별도 기준입니다.</p>
          <div style={{ overflowX: "auto" }}>
            <table className="tk-table">
              <thead><tr><th>연봉</th><th className="n">월 실수령액</th><th className="n">4대보험</th><th className="n">소득세+지방세</th></tr></thead>
              <tbody>
                {TABLE.map((t) => (
                  <tr key={t.annual}>
                    <td>{man(t.annual)}원</td>
                    <td className="n"><b>{t.net.toLocaleString()}원</b></td>
                    <td className="n">{(t.pension + t.health + t.ltc + t.employment).toLocaleString()}원</td>
                    <td className="n">{(t.incomeTax + t.localTax).toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>실수령액 계산 방법</h2>
          <p>월 실수령액 = 월 급여 − 4대보험(국민연금·건강보험·장기요양보험·고용보험) − 근로소득세 − 지방소득세</p>
          <h3>2026년 4대보험 근로자 부담 요율</h3>
          <ul>
            <li><b>국민연금 4.75%</b> — 보험료율 9.5%를 회사와 절반씩. 기준소득월액은 월 41만~659만 원 사이로 맞춥니다(2026년 7월~).</li>
            <li><b>건강보험 3.595%</b> — 보험료율 7.19%의 절반.</li>
            <li><b>장기요양보험</b> — 건강보험료의 약 13.14% (장기요양보험료율 0.9448%).</li>
            <li><b>고용보험 0.9%</b> — 실업급여 보험료율 1.8%의 절반. 산재보험은 회사가 전액 냅니다.</li>
          </ul>
          <h3>근로소득세</h3>
          <p>
            총급여에서 근로소득공제·인적공제(1인 150만 원)·국민연금과 건강·고용보험료를 뺀 과세표준에 6~45% 세율을 매기고,
            근로소득세액공제·자녀세액공제·표준세액공제를 빼서 1년 세금을 구합니다. 지방소득세는 그 10%입니다.
          </p>
        </>
      }
    >
      <SalaryForm />
    </ToolPage>
  );
}
