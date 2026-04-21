"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import { FileData } from "./types";

interface MergePreviewProps {
  files: FileData[];
  standardColumns: string[];
  onClose: () => void;
}

export default function MergePreview({ files, standardColumns, onClose }: MergePreviewProps) {
  const previewRows = files.flatMap((file) =>
    file.allData.slice(0, 2).map((row) => {
      const newRow: Record<string, any> = {};
      standardColumns.forEach((std) => {
        const origin =
          Object.keys(file.mapping).find((k) => file.mapping[k] === std) ||
          (file.headers.includes(std) ? std : null);
        newRow[std] = origin ? row[origin] ?? "" : "";
      });
      newRow["__source__"] = file.name;
      return newRow;
    })
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">병합 미리보기</h2>
              <p className="text-[10px] text-slate-400 font-bold">파일별 최대 2행 · 총 {previewRows.length}행 표시</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 테이블 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="w-full overflow-x-auto pb-2">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2 text-[10px] font-black text-slate-400 border-b">출처 파일</th>
                  {standardColumns.map((col) => (
                    <th key={col} className="px-3 py-2 text-[10px] font-black text-blue-600 border-b">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {previewRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-3 py-1.5 text-[10px] text-slate-400 font-bold">{row["__source__"]}</td>
                    {standardColumns.map((col) => (
                      <td key={col} className="px-3 py-1.5 font-bold text-slate-700">
                        {row[col]?.toString() || <span className="text-slate-300">-</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
