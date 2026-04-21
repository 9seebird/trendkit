"use client";

import React from "react";
import { FileSpreadsheet, Star, Settings2, Trash2, Edit3, Save, GripVertical } from "lucide-react";
import { FileData, EditingHeader } from "./types";
import { STYLES } from "./styles";
import MappingSettings from "./MappingSettings";

interface FileCardProps {
  file: FileData;
  isRef: boolean;
  isSettingsOpen: boolean;
  standardColumns: string[];
  editingHeader: EditingHeader | null;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onToggleReference: (fileId: string) => void;
  onToggleSettings: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  onToggleColumn: (col: string) => void;
  onMappingChange: (fileId: string, header: string, value: string | null) => void;
  onEditHeader: (editing: EditingHeader) => void;
  onSaveHeader: () => void;
  onEditingHeaderChange: (value: string) => void;
}

export default function FileCard({
  file, isRef, isSettingsOpen, standardColumns, editingHeader, dragHandleProps,
  onToggleReference, onToggleSettings, onDelete,
  onToggleColumn, onMappingChange, onEditHeader, onSaveHeader, onEditingHeaderChange,
}: FileCardProps) {
  return (
    <div className={`${STYLES.card} ${isRef ? "ring-2 ring-blue-400 border-transparent shadow-md shadow-blue-100" : "border-slate-100"}`}>

      {/* 카드 헤더 */}
      <div className="px-5 py-3 flex flex-row justify-between items-center bg-white border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded text-slate-400"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className={`p-2 rounded-xl ${isRef ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div className="flex flex-col text-xs font-black text-slate-800">
            <span className="flex items-center gap-2">
              {file.name}
              {isRef && (
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Ref</span>
              )}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              {file.allData.length.toLocaleString()} Rows
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center gap-1.5 flex-nowrap min-w-max ml-4 h-8">
          <button
            onClick={() => onToggleReference(file.id)}
            className={`${STYLES.buttonBase} ${isRef ? STYLES.activeBlueBtn : STYLES.blueBtn}`}
          >
            <Star className="w-3 h-3" /> {isRef ? "기준됨" : "기준 설정"}
          </button>
          <button
            onClick={() => onToggleSettings(file.id)}
            className={`${STYLES.buttonBase} ${isSettingsOpen ? STYLES.activeSettingsBtn : STYLES.settingsBtn}`}
          >
            <Settings2 className="w-3 h-3" /> 매핑 설정
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className={`${STYLES.buttonBase} ${STYLES.redBtn}`}
          >
            <Trash2 className="w-3 h-3" /> 삭제
          </button>
        </div>
      </div>

      {/* 매핑 설정 패널 */}
      {isSettingsOpen && (
        <MappingSettings
          file={file}
          standardColumns={standardColumns}
          onMappingChange={onMappingChange}
        />
      )}

      {/* 데이터 미리보기 테이블 */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-slate-50/50">
              {file.headers.map((h, idx) => {
                const isMatch =
                  standardColumns.includes(h) ||
                  (file.mapping[h] != null && standardColumns.includes(file.mapping[h]!));
                const isEditing =
                  editingHeader?.fileId === file.id && editingHeader?.oldName === h;
                return (
                  <th
                    key={`${h}-${idx}`}
                    className={`${STYLES.th} ${isMatch ? "bg-blue-50/50 text-blue-800" : "text-slate-400"}`}
                    onClick={() => !isEditing && onToggleColumn(h)}
                  >
                    <div className="flex items-center gap-1 justify-center min-h-[16px]">
                      {isEditing ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            autoFocus
                            value={editingHeader.value}
                            onChange={(e) => onEditingHeaderChange(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") onSaveHeader(); }}
                            className="text-xs border border-blue-300 rounded px-1 w-20 font-black outline-none bg-white"
                          />
                          <Save
                            className="w-3 h-3 text-blue-600 cursor-pointer"
                            onClick={onSaveHeader}
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-xs font-black tracking-tight">{h}</span>
                          <Edit3
                            className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all ml-0.5 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditHeader({ fileId: file.id, oldName: h, value: h });
                            }}
                          />
                        </>
                      )}
                    </div>
                    {isMatch && !isEditing && (
                      <span className="text-[10px] mt-0.5 text-blue-500 block font-black border-t border-blue-100 pt-0.5">
                        → {file.mapping[h] || h}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {file.preview.map((row, i) => (
              <tr key={`row-${i}`} className="hover:bg-slate-50/50 transition-colors">
                {file.headers.map((h, j) => {
                  const isSel =
                    standardColumns.includes(h) ||
                    (file.mapping[h] != null && standardColumns.includes(file.mapping[h]!));
                  return (
                    <td
                      key={`cell-${i}-${j}`}
                      className={`${STYLES.td} ${isSel ? "text-slate-900 bg-blue-50/20 shadow-inner" : "text-slate-500/80"}`}
                    >
                      {row[h]?.toString() || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
