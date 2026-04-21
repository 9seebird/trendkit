"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { FileData } from "./types";

interface MappingSettingsProps {
  file: FileData;
  standardColumns: string[];
  onMappingChange: (fileId: string, header: string, value: string | null) => void;
}

export default function MappingSettings({ file, standardColumns, onMappingChange }: MappingSettingsProps) {
  const mappingCount: Record<string, number> = {};
  file.headers.forEach((h) => {
    const mapped = file.mapping[h];
    if (mapped) mappingCount[mapped] = (mappingCount[mapped] || 0) + 1;
  });

  const duplicates = Object.entries(mappingCount)
    .filter(([, count]) => count > 1)
    .map(([col]) => `'${col}'`);

  return (
    <div className="p-4 bg-slate-50 border-b border-slate-100">
      {duplicates.length > 0 && (
        <div className="mb-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 font-bold leading-relaxed">
            <span className="font-black">중복 매핑 감지!</span>{" "}
            {duplicates.join(", ")} 컬럼에 여러 항목이 연결되어 있어요. 마지막으로 매핑된 값만 저장돼요.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {file.headers.map((header, idx) => {
          const mappedTo = file.mapping[header];
          const isDuplicate = mappedTo ? (mappingCount[mappedTo] || 0) > 1 : false;
          return (
            <div
              key={`${header}-${idx}`}
              className={`bg-white p-2 rounded-xl border shadow-xs transition-all ${
                isDuplicate ? "border-amber-300 bg-amber-50/50" : "border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 truncate block mb-1 font-black uppercase tracking-tighter">
                {header}
              </span>
              <select
                value={file.mapping[header] || ""}
                onChange={(e) => onMappingChange(file.id, header, e.target.value || null)}
                className={`text-xs w-full bg-slate-50 border-none rounded-lg py-1 px-1 outline-none font-bold ${
                  isDuplicate ? "text-amber-600" : "text-blue-600"
                }`}
              >
                <option value="">(제외)</option>
                {standardColumns.map((col, ci) => (
                  <option key={`${col}-${ci}`} value={col}>{col}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
