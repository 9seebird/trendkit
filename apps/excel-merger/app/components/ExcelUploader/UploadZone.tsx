"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (files: FileList) => void;
}

export default function UploadZone({ onUpload, onDropFiles }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) onDropFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`max-w-6xl mx-auto relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer group flex flex-col items-center justify-center min-h-[120px] transition-all ${
        isDragging ? "border-blue-400 bg-blue-50/50" : "border-slate-200 hover:bg-blue-50/50"
      }`}
    >
      <input
        type="file"
        multiple
        accept=".xlsx,.xls,.csv"
        onChange={onUpload}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      <Upload
        className={`h-8 w-8 mb-2 transition-all ${
          isDragging ? "text-blue-500" : "text-slate-300 group-hover:text-blue-500"
        }`}
      />
      <p className="text-sm text-slate-500 font-bold">파일 선택</p>
      <p className="text-[11px] text-slate-400 font-medium mt-1">엑셀 또는 CSV 파일을 추가하거나 드래그하세요</p>
    </div>
  );
}
