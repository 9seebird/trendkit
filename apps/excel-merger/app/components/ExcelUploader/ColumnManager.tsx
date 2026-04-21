"use client";

import React, { useState } from "react";
import { Settings2, X } from "lucide-react";

interface ColumnManagerProps {
  standardColumns: string[];
  onAddColumn: (col: string) => void;
  onRemoveColumn: (col: string) => void;
  onReset: () => void;
}

export default function ColumnManager({ standardColumns, onAddColumn, onRemoveColumn, onReset }: ColumnManagerProps) {
  const [newColName, setNewColName] = useState("");

  const handleAdd = () => {
    if (newColName.trim()) {
      onAddColumn(newColName.trim());
      setNewColName("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm flex items-center gap-2 text-blue-600 font-black">
          <Settings2 className="w-4 h-4" /> 병합 기준 컬럼
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 border border-red-100"
        >
          전체 초기화
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[30px]">
        {standardColumns.map((col, idx) => (
          <span
            key={`${col}-${idx}`}
            className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs flex items-center shadow-sm"
          >
            {col}
            <X
              className="w-3 h-3 ml-1.5 cursor-pointer hover:text-red-200"
              onClick={() => onRemoveColumn(col)}
            />
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          placeholder="기준 컬럼 직접 추가"
          className="text-xs border border-slate-200 rounded-xl px-4 py-2 flex-1 focus:ring-2 ring-blue-500 outline-none bg-white"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-700"
        >
          추가
        </button>
      </div>
    </div>
  );
}
