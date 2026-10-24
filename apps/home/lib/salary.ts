// 연봉 실수령액 계산 (2026년 기준). 화면 계산과 페이지의 연봉별 표가 같이 쓴다.
//
// 4대보험 (근로자 부담)
//   국민연금 4.75% (2026년 9.5% 의 절반) — 기준소득월액 상·하한 41만~659만 (2026.7~2027.6)
//   건강보험 3.595% (7.19% 의 절반)
//   장기요양 건강보험료 × 0.9448/7.19 (= 보수 대비 약 0.4724%)
//   고용보험 0.9%
// 소득세는 연말정산 방식으로 1년치를 계산해 12로 나눈 어림값이다.
//   회사가 매달 떼는 금액은 국세청 '근로소득 간이세액표'를 따르므로 몇천~몇만 원 차이 날 수 있고,
//   그 차이는 다음 해 연말정산에서 정산된다.

export const RATES = {
  year: 2026,
  pension: 0.0475,
  pensionMin: 410_000,
  pensionMax: 6_590_000,
  health: 0.03595,
  ltcOfHealth: 0.9448 / 7.19,
  employment: 0.009,
};

export type SalaryInput = {
  annual: number;            // 연봉 (원)
  severanceIncluded?: boolean; // 연봉에 퇴직금 포함이면 13으로 나눈다
  nonTaxMonthly?: number;    // 비과세 (식대 등, 월)
  family?: number;           // 공제대상 가족 수 (본인 포함)
  children?: number;         // 8세 이상 20세 이하 자녀 수
};

const r10 = (n: number) => Math.floor(n / 10) * 10;     // 원 단위 절사 (10원 미만)

// 근로소득공제
function earnedDeduction(total: number) {
  let d;
  if (total <= 5_000_000) d = total * 0.7;
  else if (total <= 15_000_000) d = 3_500_000 + (total - 5_000_000) * 0.4;
  else if (total <= 45_000_000) d = 7_500_000 + (total - 15_000_000) * 0.15;
  else if (total <= 100_000_000) d = 12_000_000 + (total - 45_000_000) * 0.05;
  else d = 14_750_000 + (total - 100_000_000) * 0.02;
  return Math.min(d, 20_000_000);
}

// 종합소득세 기본세율 (2023년 귀속부터)
const BRACKETS: [number, number, number][] = [
  [14_000_000, 0.06, 0],
  [50_000_000, 0.15, 1_260_000],
  [88_000_000, 0.24, 5_760_000],
  [150_000_000, 0.35, 15_440_000],
  [300_000_000, 0.38, 19_940_000],
  [500_000_000, 0.40, 25_940_000],
  [1_000_000_000, 0.42, 35_940_000],
  [Infinity, 0.45, 65_940_000],
];
function baseTax(taxable: number) {
  if (taxable <= 0) return 0;
  for (const [upto, rate, minus] of BRACKETS) if (taxable <= upto) return taxable * rate - minus;
  return 0;
}

// 근로소득세액공제 (한도 포함)
function earnedTaxCredit(tax: number, total: number) {
  const credit = tax <= 1_300_000 ? tax * 0.55 : 715_000 + (tax - 1_300_000) * 0.3;
  let cap;
  if (total <= 33_000_000) cap = 740_000;
  else if (total <= 70_000_000) cap = Math.max(660_000, 740_000 - (total - 33_000_000) * 0.008);
  else if (total <= 120_000_000) cap = Math.max(500_000, 660_000 - (total - 70_000_000) / 2);
  else cap = Math.max(200_000, 500_000 - (total - 120_000_000) / 2);
  return Math.min(credit, cap);
}

// 자녀세액공제 (2025년 개정: 1명 25만, 2명 55만, 3명부터 1명당 40만 추가)
function childCredit(n: number) {
  if (n <= 0) return 0;
  if (n === 1) return 250_000;
  return 550_000 + (n - 2) * 400_000;
}

export function calcSalary(inp: SalaryInput) {
  const months = inp.severanceIncluded ? 13 : 12;
  const monthlyGross = inp.annual / months;
  const nonTax = Math.min(inp.nonTaxMonthly ?? 200_000, monthlyGross);
  const monthlyTaxable = Math.max(0, monthlyGross - nonTax);

  const pensionBase = Math.min(Math.max(Math.floor(monthlyTaxable / 1000) * 1000, RATES.pensionMin), RATES.pensionMax);
  const pension = monthlyTaxable > 0 ? r10(pensionBase * RATES.pension) : 0;
  const health = r10(monthlyTaxable * RATES.health);
  const ltc = r10(health * RATES.ltcOfHealth);
  const employment = r10(monthlyTaxable * RATES.employment);

  // 소득세 — 1년치
  const total = monthlyTaxable * 12;                 // 총급여 (비과세 제외)
  const earned = total - earnedDeduction(total);
  const personal = 1_500_000 * Math.max(1, inp.family ?? 1);
  const insuranceDeduction = (health + ltc + employment) * 12;   // 특별소득공제 (건강·장기요양·고용보험료)
  const taxable = Math.max(0, earned - personal - pension * 12 - insuranceDeduction);
  const tax = baseTax(taxable);
  const decided = Math.max(0, tax - earnedTaxCredit(tax, total) - childCredit(inp.children ?? 0) - 130_000);
  const incomeTax = r10(decided / 12);
  const localTax = r10(incomeTax * 0.1);

  const deductions = pension + health + ltc + employment + incomeTax + localTax;
  const net = monthlyGross - deductions;
  return {
    monthlyGross: Math.round(monthlyGross), nonTax: Math.round(nonTax),
    pension, health, ltc, employment, incomeTax, localTax,
    deductions, net: Math.round(net), netAnnual: Math.round(net * months),
    deductionRate: monthlyGross ? deductions / monthlyGross : 0,
  };
}
