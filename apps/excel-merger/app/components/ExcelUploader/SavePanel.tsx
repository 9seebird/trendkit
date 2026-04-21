"use client";

import React, { useState } from "react";
import { Download, FileCheck, Eye } from "lucide-react";
import { STYLES } from "./styles";
import { FileData } from "./types";

interface SavePanelProps {
  files: FileData[];
  standardColumns: string[];
  onDownload: (fileName: string) => void;
  onPreview: () => void;
}

export default function SavePanel({ files, standardColumns, onDownload, onPreview }: SavePanelProps) {
  const [outputFileName, setOutputFileName] = useState("병합결과_데이터");
  const [isHovered, setIsHovered] = useState(false); // 호버 상태 직접 관리
  const totalRows = files.reduce((sum, f) => sum + f.allData.length, 0);

  // 호버 시 적용할 1순위 스타일 (인라인 스타일은 모든 CSS를 이깁니다)
  const hoverStyle = isHovered ? {
    backgroundColor: '#3b82f6', // blue-500
    color: '#ffffff',
    borderColor: '#3b82f6'
  } : {};

  return (
    <div className={STYLES.savePanel}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="bg-green-600 p-2.5 rounded-xl text-white shadow-md">
          <FileCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-green-800 dark:text-green-200 text-sm font-black">병합 준비 완료!</p>
          <p className="text-green-600 dark:text-green-400 text-[11px] font-bold mt-0.5">
            {files.length}개 파일 · {standardColumns.length}개 컬럼 · 총 {totalRows.toLocaleString()}행
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={hoverStyle}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border text-green-700 bg-white border-green-200 dark:text-green-300 dark:bg-slate-800 dark:border-green-700 shadow-sm active:scale-95"
          >
            <Eye className={`w-3.5 h-3.5 ${isHovered ? 'text-white' : ''}`} /> 미리보기
          </button>
          
          <input
            type="text"
            value={outputFileName}
            onChange={(e) => setOutputFileName(e.target.value)}
            className="w-44 px-3 py-2 rounded-xl border border-green-200 dark:border-green-700 focus:border-green-500 outline-none text-xs font-black bg-white dark:bg-slate-800 dark:text-slate-100"
          />
          
          <button
            onClick={() => onDownload(outputFileName)}
            className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-green-700 flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" /> 지금 저장
          </button>
        </div>
      </div>
    </div>
  );
}