"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, FileSpreadsheet, X, Settings2, Download, Star, Trash2, Edit3, Save, FileCheck 
} from 'lucide-react';

const STYLES = {
  card: "bg-white border rounded-2xl shadow-sm overflow-hidden mx-auto max-w-[99%] transition-all",
  buttonBase: "flex items-center justify-center gap-1 px-3 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap min-w-[80px] h-8",
  blueBtn: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
  activeBlueBtn: "bg-blue-500 text-white border-blue-500 shadow-sm",
  redBtn: "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-sm min-w-[60px]",
  settingsBtn: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
  activeSettingsBtn: "bg-slate-800 text-white border-slate-800",
  th: "px-3 py-2 border-b transition-all cursor-pointer group relative text-center",
  td: "px-3 py-1.5 text-[10px] border-r border-slate-50 last:border-r-0 font-bold text-slate-700",
  savePanel: "max-w-6xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom-2"
};

interface FileData {
  id: string;
  name: string;
  hash: string;
  headers: string[];
  mapping: Record<string, string | null>;
  preview: any[];
  allData: any[];
}

export default function ExcelUploader() {
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [openSettings, setOpenSettings] = useState<string[]>([]);
  const [standardColumns, setStandardColumns] = useState<string[]>([]);
  const [newColName, setNewColName] = useState("");
  const [referenceFileId, setReferenceFileId] = useState<string | null>(null);
  const [editingHeader, setEditingHeader] = useState<{fileId: string, oldName: string, value: string} | null>(null);
  const [outputFileName, setOutputFileName] = useState("병합결과_데이터");

  useEffect(() => { setIsMounted(true); }, []);

  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    const newFiles: FileData[] = [];
    for (const file of Array.from(uploadedFiles)) {
      try {
        const fileHash = await calculateHash(file);
        if (files.some(f => f.hash === fileHash)) {
          alert(`'${file.name}'은(는) 이미 추가되어 있습니다.`);
          continue;
        }
        const data = await file.arrayBuffer();
        let workbook = file.name.endsWith('.csv') 
          ? XLSX.read(new TextDecoder('euc-kr').decode(data), { type: 'string' })
          : XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        const filteredRows = rawRows.filter(row => row.some(cell => cell !== ""));
        if (filteredRows.length > 0) {
          const headers = filteredRows[0].map((h: any, i: number) => String(h).trim() || `COL_${i + 1}`);
          const jsonData = filteredRows.slice(1).map(row => {
            const obj: any = {};
            headers.forEach((h, i) => { obj[h] = row[i]; });
            return obj;
          });
          newFiles.push({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name, hash: fileHash, headers, mapping: {}, 
            preview: jsonData.slice(0, 3),
            allData: jsonData
          });
        }
      } catch (error) { console.error(error); }
    }
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const saveHeaderRename = () => {
    if (!editingHeader) return;
    const { fileId, oldName, value: newName } = editingHeader;
    if (!newName || newName === oldName) { setEditingHeader(null); return; }
    setStandardColumns(prev => prev.map(col => col === oldName ? newName : col));
    setFiles(prev => prev.map(file => {
      if (file.id !== fileId) return file;
      const newHeaders = file.headers.map(h => h === oldName ? newName : h);
      const updateData = (arr: any[]) => arr.map(row => ({ ...row, [newName]: row[oldName] }));
      return { ...file, headers: newHeaders, preview: updateData(file.preview), allData: updateData(file.allData) };
    }));
    setEditingHeader(null);
  };

  /**
   * [핵심 수정] 기준 설정 해제 시 컬럼과 매핑 정보를 완전히 초기화
   */
  const handleToggleReference = (fileId: string) => {
    if (referenceFileId === fileId) {
      setReferenceFileId(null);
      setStandardColumns([]); // 상단 배지 리스트 비움
      // 모든 파일의 매핑 정보도 초기화하여 잔상이 남지 않게 함
      setFiles(prev => prev.map(f => ({ ...f, mapping: {} })));
    } else {
      const target = files.find(f => f.id === fileId);
      if (target) {
        setReferenceFileId(fileId);
        setStandardColumns(target.headers);
        // 새로운 기준에 맞춰 자동 매핑 시도
        setFiles(prev => prev.map(f => {
          const newMapping: Record<string, string | null> = {};
          f.headers.forEach(h => {
            newMapping[h] = target.headers.includes(h) ? h : null;
          });
          return { ...f, mapping: newMapping };
        }));
      }
    }
  };

  /**
   * [핵심 수정] 저장 위치 지정 창이 뜨면서 + 크롬 다운로드 기록에도 남는 방식
   */
  const mergeAndDownload = async () => {
    if (files.length === 0 || standardColumns.length === 0) return alert("기준 설정을 완료해주세요.");
    const merged = files.flatMap(file => file.allData.map(row => {
      const newRow: any = {};
      standardColumns.forEach(std => {
        const origin = Object.keys(file.mapping).find(k => file.mapping[k] === std) || (file.headers.includes(std) ? std : null);
        newRow[std] = origin ? row[origin] : "";
      });
      return newRow;
    }));
    const ws = XLSX.utils.json_to_sheet(merged);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result");

    // XLSX.writeFile을 사용하면 크롬 다운로드 목록에도 남고, 
    // 브라우저 설정(항상 확인)에 따라 탐색기 창도 띄워줍니다.
    XLSX.writeFile(wb, `${outputFileName}.xlsx`);
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 space-y-5 bg-slate-50 min-h-screen font-bold text-slate-800" suppressHydrationWarning>
      
      {/* 1. 상단 컨트롤 박스 */}
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm flex items-center gap-2 text-blue-600 font-black"><Settings2 className="w-4 h-4" /> 병합 기준 컬럼</h3>
          <button onClick={() => {setStandardColumns([]); setReferenceFileId(null); setFiles(prev => prev.map(f => ({...f, mapping: {}})));}} className="text-[10px] text-red-500 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 border border-red-100">전체 초기화</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[30px]">
          {standardColumns.map((col, idx) => (
            <span key={`${col}-${idx}`} className="bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] flex items-center shadow-sm">
              {col} <X className="w-3 h-3 ml-1.5 cursor-pointer hover:text-red-200" onClick={() => setStandardColumns(prev => prev.filter(c => c !== col))} />
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newColName} onChange={(e) => setNewColName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setStandardColumns([...standardColumns, newColName]), setNewColName(""))} placeholder="기준 컬럼 직접 추가" className="text-xs border border-slate-200 rounded-xl px-4 py-2 flex-1 focus:ring-2 ring-blue-500 outline-none" />
          <button onClick={() => { if(newColName) { setStandardColumns([...standardColumns, newColName]); setNewColName(""); } }} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-blue-700">추가</button>
        </div>
      </div>

      {/* 2. 업로드 영역 */}
      <div className="max-w-6xl mx-auto relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-blue-50/50 transition-all cursor-pointer group">
        <input type="file" multiple accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        <Upload className="mx-auto h-8 w-8 text-slate-300 mb-2 group-hover:text-blue-500 transition-all" />
        <p className="text-xs text-slate-400 font-bold">엑셀 또는 CSV 파일을 추가하세요</p>
      </div>

      {/* 3. 저장 UI 패널 */}
      {files.length > 0 && (
        <div className={STYLES.savePanel}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-green-600 p-2.5 rounded-xl text-white shadow-md"><FileCheck className="w-5 h-5" /></div>
            <div className="flex-1 text-center sm:text-left text-green-800 text-sm font-black">병합 준비 완료!</div>
            <div className="flex items-center gap-2">
              <input type="text" value={outputFileName} onChange={(e) => setOutputFileName(e.target.value)} className="w-48 px-3 py-2 rounded-xl border border-green-200 focus:border-green-500 outline-none text-xs font-black bg-white" />
              <button onClick={mergeAndDownload} className="bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-green-700 flex items-center gap-2 shadow-md active:scale-95 transition-all">
                <Download className="w-4 h-4" /> 지금 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 파일 카드 리스트 */}
      <div className="space-y-6 pb-20">
        {files.map((file) => {
          const isRef = referenceFileId === file.id;
          const isSetOpen = openSettings.includes(file.id);
          return (
            <div key={file.id} className={`${STYLES.card} ${isRef ? 'ring-2 ring-blue-400 border-transparent shadow-md shadow-blue-100' : 'border-slate-100'}`}>
              <div className="px-5 py-3 flex flex-row justify-between items-center bg-white border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isRef ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}><FileSpreadsheet className="w-5 h-5" /></div>
                  <div className="flex flex-col text-xs font-black text-slate-800">
                    <span className="flex items-center gap-2">{file.name} {isRef && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded">Ref</span>}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{file.allData.length} Rows</span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-1.5 flex-nowrap min-w-max ml-4 h-8">
                  <button onClick={() => handleToggleReference(file.id)} className={`${STYLES.buttonBase} ${isRef ? STYLES.activeBlueBtn : STYLES.blueBtn}`}><Star className="w-3 h-3" /> {isRef ? '기준됨' : '기준 설정'}</button>
                  <button onClick={() => setOpenSettings(prev => prev.includes(file.id) ? prev.filter(i => i !== file.id) : [...prev, file.id])} className={`${STYLES.buttonBase} ${isSetOpen ? STYLES.activeSettingsBtn : STYLES.settingsBtn}`}><Settings2 className="w-3 h-3" /> 매핑 설정</button>
                  <button onClick={() => setFiles(files.filter(f => f.id !== file.id))} className={`${STYLES.buttonBase} ${STYLES.redBtn}`}><Trash2 className="w-3 h-3" /> 삭제</button>
                </div>
              </div>

              {isSetOpen && (
                <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {file.headers.map((header, idx) => (
                    <div key={`${header}-${idx}`} className="bg-white p-2 rounded-xl border border-slate-100 shadow-xs">
                      <span className="text-[9px] text-slate-400 truncate block mb-1 font-black uppercase tracking-tighter">{header}</span>
                      <select 
                        value={file.mapping[header] || ""} 
                        onChange={(e) => setFiles(prev => prev.map(f => f.id === file.id ? { ...f, mapping: { ...f.mapping, [header]: e.target.value || null } } : f))}
                        className="text-[10px] w-full bg-slate-50 border-none rounded-lg py-1 px-1 text-blue-600 outline-none font-bold"
                      >
                        <option value="">(제외)</option>
                        {standardColumns.map((col, ci) => <option key={`${col}-${ci}`} value={col}>{col}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto relative bg-white">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-50/50">
                      {file.headers.map((h, idx) => {
                        const isMatch = standardColumns.includes(h) || (file.mapping[h] && standardColumns.includes(file.mapping[h]!));
                        const isEditing = editingHeader?.fileId === file.id && editingHeader?.oldName === h;
                        return (
                          <th key={`${h}-${idx}`} onClick={() => !isEditing && setStandardColumns(prev => prev.includes(h) ? prev.filter(c => c !== h) : [...prev, h])} className={`${STYLES.th} ${isMatch ? 'bg-blue-50/50 text-blue-800' : 'text-slate-400'}`}>
                            <div className="flex items-center gap-1 justify-center min-h-[16px]">
                              {isEditing ? (
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}><input autoFocus value={editingHeader.value} onChange={(e) => setEditingHeader({...editingHeader, value: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && saveHeaderRename()} className="text-[10px] border border-blue-300 rounded px-1 w-20 font-black outline-none bg-white" /><Save className="w-3 h-3 text-blue-600 cursor-pointer" onClick={saveHeaderRename} /></div>
                              ) : (
                                <><span className="text-[10px] font-black tracking-tight">{h}</span><Edit3 className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all ml-0.5" onClick={(e) => { e.stopPropagation(); setEditingHeader({fileId: file.id, oldName: h, value: h}); }} /></>
                              )}
                            </div>
                            {isMatch && !isEditing && <span className="text-[8px] mt-0.5 text-blue-500 block font-black border-t border-blue-100 pt-0.5 animate-in fade-in">→ {file.mapping[h] || h}</span>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {file.preview.map((row, i) => (
                      <tr key={`row-${i}`} className="hover:bg-slate-50/50 transition-colors">
                        {file.headers.map((h, j) => {
                          const isSel = standardColumns.includes(h) || (file.mapping[h] && standardColumns.includes(file.mapping[h]!));
                          return (
                            <td key={`cell-${i}-${j}`} className={`${STYLES.td} ${isSel ? 'text-slate-900 bg-blue-50/20' : 'text-slate-500/80'}`}>{row[h]?.toString() || ""}</td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}