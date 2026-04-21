"use client";

import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { FileData, EditingHeader } from "./types";
import ColumnManager from "./ColumnManager";
import UploadZone from "./UploadZone";
import SavePanel from "./SavePanel";
import FileCard from "./FileCard";
import Toast from "./Toast";
import MergePreview from "./MergePreview";
import { useToast } from "./useToast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function ExcelUploader() {
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [openSettings, setOpenSettings] = useState<string[]>([]);
  const [standardColumns, setStandardColumns] = useState<string[]>([]);
  const [referenceFileId, setReferenceFileId] = useState<string | null>(null);
  const [editingHeader, setEditingHeader] = useState<EditingHeader | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { setIsMounted(true); }, []);

  // Escape 키로 헤더 편집 취소
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingHeader(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ─── 파일 해시 계산 ───────────────────────────────────────────────────────
  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  // ─── 파일 파싱 ───────────────────────────────────────────────────────────
  const parseFiles = useCallback(async (rawFiles: File[], existingFiles: FileData[]) => {
    const newFiles: FileData[] = [];
    for (const file of rawFiles) {
      try {
        const fileHash = await calculateHash(file);
        if (
          existingFiles.some((f) => f.hash === fileHash) ||
          newFiles.some((f) => f.hash === fileHash)
        ) {
          addToast(`'${file.name}'은(는) 이미 추가되어 있어요.`, "warning");
          continue;
        }
        const data = await file.arrayBuffer();
        const workbook = file.name.endsWith(".csv")
          ? XLSX.read(new TextDecoder("euc-kr").decode(data), { type: "string" })
          : XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        const filteredRows = rawRows.filter((row) => row.some((cell) => cell !== ""));
        if (filteredRows.length > 0) {
          const headers = filteredRows[0].map((h: any, i: number) =>
            String(h).trim() || `COL_${i + 1}`
          );
          const jsonData = filteredRows.slice(1).map((row) => {
            const obj: any = {};
            headers.forEach((h: string, i: number) => { obj[h] = row[i]; });
            return obj;
          });
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            hash: fileHash,
            headers,
            mapping: {},
            preview: jsonData.slice(0, 3),
            allData: jsonData,
          });
        }
      } catch {
        addToast(`'${file.name}' 파일을 읽는 중 오류가 발생했어요.`, "error");
      }
    }
    return newFiles;
  }, [addToast]);

  // ─── 새 파일 추가 후 기준 자동 설정 ─────────────────────────────────────
  const applyNewFiles = useCallback(
    (newFiles: FileData[], prevFiles: FileData[], prevRefId: string | null) => {
      if (newFiles.length === 0) return;
      const allFiles = [...prevFiles, ...newFiles];

      if (!prevRefId) {
        // 기준 파일 없으면 첫 번째 파일을 자동 기준 설정
        const ref = allFiles[0];
        setReferenceFileId(ref.id);
        setStandardColumns(ref.headers);
        setFiles(
          allFiles.map((f) => {
            const newMapping: Record<string, string | null> = {};
            f.headers.forEach((h) => { newMapping[h] = ref.headers.includes(h) ? h : null; });
            return { ...f, mapping: newMapping };
          })
        );
        addToast(`'${ref.name}'이 기준 파일로 자동 설정됐어요.`, "info");
      } else {
        // 기준이 이미 있으면 새 파일만 자동 매핑
        const ref = prevFiles.find((f) => f.id === prevRefId)!;
        setFiles(
          allFiles.map((f) => {
            if (prevFiles.find((pf) => pf.id === f.id)) return f;
            const newMapping: Record<string, string | null> = {};
            f.headers.forEach((h) => { newMapping[h] = ref.headers.includes(h) ? h : null; });
            return { ...f, mapping: newMapping };
          })
        );
      }
      addToast(`${newFiles.length}개 파일이 추가됐어요.`, "success");
    },
    [addToast]
  );

  // ─── 파일 업로드 (input) ─────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = await parseFiles(Array.from(e.target.files), files);
    applyNewFiles(newFiles, files, referenceFileId);
    e.target.value = "";
  };

  // ─── 파일 드롭 ───────────────────────────────────────────────────────────
  const handleDropFiles = async (fileList: FileList) => {
    const newFiles = await parseFiles(Array.from(fileList), files);
    applyNewFiles(newFiles, files, referenceFileId);
  };

  // ─── 드래그 앤 드롭 순서 변경 ────────────────────────────────────────────
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(files);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setFiles(items);
  };

  // ─── 헤더 이름 변경 ──────────────────────────────────────────────────────
  const saveHeaderRename = () => {
    if (!editingHeader) return;
    const { fileId, oldName, value: newName } = editingHeader;
    if (!newName.trim() || newName === oldName) { setEditingHeader(null); return; }
    setStandardColumns((prev) => prev.map((col) => (col === oldName ? newName : col)));
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        const newHeaders = file.headers.map((h) => (h === oldName ? newName : h));
        const updateData = (arr: any[]) =>
          arr.map((row) => ({ ...row, [newName]: row[oldName] }));
        return { ...file, headers: newHeaders, preview: updateData(file.preview), allData: updateData(file.allData) };
      })
    );
    setEditingHeader(null);
    addToast(`'${oldName}' → '${newName}'으로 변경됐어요.`, "success");
  };

  // ─── 기준 파일 토글 ───────────────────────────────────────────────────────
  const handleToggleReference = (fileId: string) => {
    if (referenceFileId === fileId) {
      setReferenceFileId(null);
      setStandardColumns([]);
      setFiles((prev) => prev.map((f) => ({ ...f, mapping: {} })));
      addToast("기준 파일이 해제됐어요.", "info");
    } else {
      const target = files.find((f) => f.id === fileId);
      if (!target) return;
      setReferenceFileId(fileId);
      setStandardColumns(target.headers);
      setFiles((prev) =>
        prev.map((f) => {
          const newMapping: Record<string, string | null> = {};
          f.headers.forEach((h) => { newMapping[h] = target.headers.includes(h) ? h : null; });
          return { ...f, mapping: newMapping };
        })
      );
      addToast(`'${target.name}'이 기준 파일로 설정됐어요.`, "info");
    }
  };

  // ─── 매핑 변경 ────────────────────────────────────────────────────────────
  const handleMappingChange = (fileId: string, header: string, value: string | null) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, mapping: { ...f.mapping, [header]: value } } : f
      )
    );
  };

  // ─── 전체 초기화 ─────────────────────────────────────────────────────────
  const handleReset = () => {
    setStandardColumns([]);
    setReferenceFileId(null);
    setFiles((prev) => prev.map((f) => ({ ...f, mapping: {} })));
    addToast("기준 컬럼이 초기화됐어요.", "info");
  };

  // ─── 파일 삭제 ───────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    const target = files.find((f) => f.id === id);
    const remaining = files.filter((f) => f.id !== id);
    setFiles(remaining);

    if (remaining.length === 0) {
      setStandardColumns([]);
      setReferenceFileId(null);
    } else if (referenceFileId === id) {
      const newRef = remaining[0];
      setReferenceFileId(newRef.id);
      setStandardColumns(newRef.headers);
      setFiles(
        remaining.map((f) => {
          const newMapping: Record<string, string | null> = {};
          f.headers.forEach((h) => { newMapping[h] = newRef.headers.includes(h) ? h : null; });
          return { ...f, mapping: newMapping };
        })
      );
      addToast(`'${newRef.name}'이 새 기준 파일로 자동 설정됐어요.`, "info");
    }

    if (target) addToast(`'${target.name}'이 삭제됐어요.`, "info");
  };

  // ─── 병합 & 다운로드 ─────────────────────────────────────────────────────
  const mergeAndDownload = (outputFileName: string) => {
    if (files.length === 0 || standardColumns.length === 0) {
      addToast("기준 컬럼을 먼저 설정해주세요.", "warning");
      return;
    }
    const merged = files.flatMap((file) =>
      file.allData.map((row) => {
        const newRow: any = {};
        standardColumns.forEach((std) => {
          const origin =
            Object.keys(file.mapping).find((k) => file.mapping[k] === std) ||
            (file.headers.includes(std) ? std : null);
          newRow[std] = origin ? row[origin] ?? "" : "";
        });
        return newRow;
      })
    );
    const ws = XLSX.utils.json_to_sheet(merged);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    XLSX.writeFile(wb, `${outputFileName}.xlsx`);
    addToast(`'${outputFileName}.xlsx' 저장 완료!`, "success");
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 space-y-5 bg-slate-50 min-h-screen font-bold text-slate-800" suppressHydrationWarning>

      <Toast toasts={toasts} onRemove={removeToast} />

      {showPreview && (
        <MergePreview
          files={files}
          standardColumns={standardColumns}
          onClose={() => setShowPreview(false)}
        />
      )}

      <ColumnManager
        standardColumns={standardColumns}
        onAddColumn={(col) => setStandardColumns((prev) => [...prev, col])}
        onRemoveColumn={(col) => setStandardColumns((prev) => prev.filter((c) => c !== col))}
        onReset={handleReset}
      />

      <UploadZone onUpload={handleFileUpload} onDropFiles={handleDropFiles} />

      {files.length > 0 && standardColumns.length > 0 && (
        <SavePanel
          files={files}
          standardColumns={standardColumns}
          onDownload={mergeAndDownload}
          onPreview={() => setShowPreview(true)}
        />
      )}

      <div className="space-y-6 pb-20 max-w-6xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="files-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {files.map((file, idx) => (
                  <Draggable key={file.id} draggableId={file.id} index={idx}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <FileCard
                          file={file}
                          isRef={referenceFileId === file.id}
                          isSettingsOpen={openSettings.includes(file.id)}
                          standardColumns={standardColumns}
                          editingHeader={editingHeader}
                          dragHandleProps={provided.dragHandleProps ?? undefined}
                          onToggleReference={handleToggleReference}
                          onToggleSettings={(id) =>
                            setOpenSettings((prev) =>
                              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                            )
                          }
                          onDelete={handleDelete}
                          onToggleColumn={() => {}} // 컬럼 토글은 현재 미사용
                          onMappingChange={handleMappingChange}
                          onEditHeader={setEditingHeader}
                          onSaveHeader={saveHeaderRename}
                          onEditingHeaderChange={(value) =>
                            setEditingHeader((prev) => (prev ? { ...prev, value } : null))
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
