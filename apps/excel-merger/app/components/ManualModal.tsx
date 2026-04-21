"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Upload,
  Star,
  Settings2,
  Download,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Upload className="w-5 h-5" />,
    title: "엑셀 / CSV 파일 업로드",
    color: "blue",
    description:
      "화면 중앙의 점선 박스를 클릭하거나 파일을 드래그해서 올려주세요.",
    details: [
      ".xlsx, .xls, .csv 형식을 지원해요",
      "여러 파일을 한 번에 올릴 수 있어요",
      "같은 파일을 중복으로 올리면 알림이 떠요",
    ],
  },
  {
    number: "02",
    icon: <Star className="w-5 h-5" />,
    title: "기준 파일 설정",
    color: "yellow",
    description:
      "병합의 기준이 될 파일 카드에서 '기준 설정' 버튼을 눌러주세요.",
    details: [
      "기준 파일의 컬럼들이 상단 '병합 기준 컬럼'에 자동으로 채워져요",
      "기준 파일은 파란 테두리로 표시돼요",
      "다시 누르면 기준이 해제되고 전체 초기화돼요",
    ],
  },
  {
    number: "03",
    icon: <Settings2 className="w-5 h-5" />,
    title: "컬럼 매핑 설정",
    color: "purple",
    description: "다른 파일들의 '매핑 설정'을 눌러 컬럼을 연결해 주세요.",
    details: [
      "이름이 같은 컬럼은 자동으로 매핑돼요",
      "이름이 다른 컬럼은 드롭다운으로 직접 연결할 수 있어요",
      "✏️ 아이콘으로 헤더 이름을 직접 수정할 수도 있어요",
    ],
  },
  {
    number: "04",
    icon: <Download className="w-5 h-5" />,
    title: "병합 후 저장",
    color: "green",
    description:
      "초록색 저장 패널에서 파일명을 입력하고 '지금 저장'을 눌러주세요.",
    details: [
      "모든 파일의 데이터가 하나의 엑셀 파일로 합쳐져요",
      "기준 컬럼에 포함되지 않은 컬럼은 제외돼요",
      "파일명은 원하는 대로 바꿀 수 있어요",
    ],
  },
];

const colorMap: Record<
  string,
  { bg: string; text: string; border: string; badge: string; iconBg: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-600",
    iconBg: "bg-blue-100",
  },
  yellow: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-500",
    iconBg: "bg-amber-100",
  },
  purple: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    badge: "bg-violet-600",
    iconBg: "bg-violet-100",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    badge: "bg-emerald-600",
    iconBg: "bg-emerald-100",
  },
};

export default function ManualModal() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-black hover:bg-slate-700 transition-all shadow-sm"
      >
        <BookOpen className="w-4 h-4" />
        사용법 보기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-xl">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800">
                    Smart Excel Merger 사용법
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold">
                    4단계로 엑셀 파일을 손쉽게 병합하세요
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 스텝 탭: 이 부분만 여백과 폰트를 키워 찌그러짐을 방지했습니다. */}
            <div className="flex gap-2 px-6 pt-4 pb-2 overflow-x-auto shrink-0 bg-white">
              {steps.map((step, idx) => {
                const c = colorMap[step.color];
                const isActive = activeStep === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all border ${
                      isActive
                        ? `${c.bg} ${c.text} ${c.border}`
                        : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg text-white ${
                        isActive ? c.badge : "bg-slate-300"
                      }`}
                    >
                      {step.number}
                    </span>
                    {step.title}
                  </button>
                );
              })}
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
              {steps.map((step, idx) => {
                if (idx !== activeStep) return null;

                const c = colorMap[step.color];

                return (
                  <div key={idx} className="space-y-4">
                    <div
                      className={`${c.bg} ${c.border} border rounded-2xl p-4 flex gap-4 items-start`}
                    >
                      <div
                        className={`${c.iconBg} ${c.text} p-2.5 rounded-xl flex-shrink-0`}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <h3 className={`text-sm font-black ${c.text} mb-1`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 font-bold leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {step.details.map((detail, di) => (
                        <div
                          key={di}
                          className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-4"
                        >
                          <ChevronRight
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${c.text}`}
                          />
                          <span className="text-sm text-slate-700 font-bold leading-relaxed">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 푸터 */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                disabled={activeStep === 0}
                className="px-4 py-2 rounded-xl text-xs font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← 이전
              </button>

              <span className="text-[10px] text-slate-400 font-bold">
                {activeStep + 1} / {steps.length}
              </span>

              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() =>
                    setActiveStep((p) => Math.min(steps.length - 1, p + 1))
                  }
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-800 hover:bg-slate-700 transition-all"
                >
                  다음 →
                </button>
              ) : (
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                >
                  시작하기 ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
