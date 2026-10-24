"use client";

import { useEffect, useRef, useState } from "react";
import { LIBS, loadScript } from "@/lib/loadScript";

type Fmt = "image/jpeg" | "image/png" | "image/webp";
type Item = { id: number; name: string; size: number; status: "wait" | "work" | "done" | "error";
  out?: Blob; outName?: string; w?: number; h?: number; error?: string; preview?: string };

const EXT: Record<Fmt, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const kb = (n: number) => n >= 1_048_576 ? `${(n / 1_048_576).toFixed(2)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`;
const isHeic = (f: File) => /heic|heif/i.test(f.type) || /\.(heic|heif)$/i.test(f.name);

declare global {
  interface Window {
    heic2any?: (o: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>;
    JSZip?: new () => { file(n: string, d: Blob): void; generateAsync(o: { type: "blob" }): Promise<Blob> };
  }
}

async function toBitmapSource(file: File): Promise<Blob> {
  if (!isHeic(file)) return file;
  await loadScript(LIBS.heic2any);
  const r = await window.heic2any!({ blob: file, toType: "image/png" });
  return Array.isArray(r) ? r[0] : r;
}

async function convert(file: File, fmt: Fmt, quality: number, maxSide: number) {
  const src = await toBitmapSource(file);
  const url = URL.createObjectURL(src);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("이미지를 읽지 못했어요")); i.src = url;
    });
    let w = img.naturalWidth, h = img.naturalHeight;
    if (maxSide && Math.max(w, h) > maxSide) { const k = maxSide / Math.max(w, h); w = Math.round(w * k); h = Math.round(h * k); }
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }   // 투명 배경 → 흰색
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("변환 실패"))), fmt, quality));
    return { blob, w, h };
  } finally { URL.revokeObjectURL(url); }
}

export default function Converter() {
  const [items, setItems] = useState<Item[]>([]);
  const [fmt, setFmt] = useState<Fmt>("image/jpeg");
  const [quality, setQuality] = useState(0.8);
  const [maxSide, setMaxSide] = useState(0);
  const [drag, setDrag] = useState(false);
  const files = useRef(new Map<number, File>());
  const seq = useRef(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => () => items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)), []); // eslint-disable-line

  function add(list: FileList | null) {
    if (!list) return;
    const next: Item[] = [];
    for (const f of Array.from(list)) {
      if (!/^image\//.test(f.type) && !isHeic(f)) continue;
      const id = ++seq.current;
      files.current.set(id, f);
      next.push({ id, name: f.name, size: f.size, status: "wait" });
    }
    setItems((v) => [...v, ...next].slice(-50));
  }

  async function runAll() {
    for (const it of items) {
      const f = files.current.get(it.id); if (!f) continue;
      setItems((v) => v.map((x) => x.id === it.id ? { ...x, status: "work", error: undefined } : x));
      try {
        const { blob, w, h } = await convert(f, fmt, quality, maxSide);
        const base = it.name.replace(/\.[^.]+$/, "");
        setItems((v) => v.map((x) => {
          if (x.id !== it.id) return x;
          if (x.preview) URL.revokeObjectURL(x.preview);
          return { ...x, status: "done", out: blob, outName: `${base}.${EXT[fmt]}`, w, h, preview: URL.createObjectURL(blob) };
        }));
      } catch (e) {
        setItems((v) => v.map((x) => x.id === it.id ? { ...x, status: "error", error: (e as Error).message } : x));
      }
    }
  }

  function save(blob: Blob, name: string) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  async function saveZip() {
    await loadScript(LIBS.jszip);
    const zip = new window.JSZip!();
    const used = new Set<string>();
    for (const it of items) if (it.out && it.outName) {
      let n = it.outName, k = 1;
      while (used.has(n)) n = it.outName.replace(/(\.[^.]+)$/, `-${k++}$1`);
      used.add(n); zip.file(n, it.out);
    }
    save(await zip.generateAsync({ type: "blob" }), "trendkit-images.zip");
  }

  const done = items.filter((i) => i.out);
  const before = done.reduce((n, i) => n + i.size, 0), after = done.reduce((n, i) => n + (i.out?.size || 0), 0);

  return (
    <div className="tk-panel">
      <div className={`tk-drop ${drag ? "on" : ""}`} onClick={() => input.current?.click()}
           onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
           onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
           role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && input.current?.click()}>
        <div style={{ fontSize: 28 }}>🖼️</div>
        <b>사진을 끌어다 놓거나 눌러서 고르세요</b>
        <div style={{ fontSize: 13, marginTop: 4 }}>JPG · PNG · WEBP · HEIC(아이폰) · 한 번에 여러 장</div>
        <input ref={input} type="file" accept="image/*,.heic,.heif" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      </div>

      <div className="tk-row" style={{ marginTop: 16 }}>
        <div className="tk-field"><span>바꿀 형식</span>
          <div className="tk-seg">
            {(Object.keys(EXT) as Fmt[]).map((f) => (
              <button key={f} type="button" aria-pressed={fmt === f} onClick={() => setFmt(f)}>{EXT[f].toUpperCase()}</button>
            ))}
          </div>
        </div>
        <label className="tk-field"><span>화질 {Math.round(quality * 100)}% {fmt === "image/png" ? "(PNG는 화질 설정 없음)" : ""}</span>
          <input type="range" min={0.3} max={1} step={0.05} value={quality} disabled={fmt === "image/png"}
                 onChange={(e) => setQuality(+e.target.value)} /></label>
        <label className="tk-field"><span>크기 줄이기 (긴 변)</span>
          <select className="tk-select" value={maxSide} onChange={(e) => setMaxSide(+e.target.value)}>
            <option value={0}>원본 크기</option><option value={3840}>3840px (4K)</option><option value={2560}>2560px</option>
            <option value={1920}>1920px (FHD)</option><option value={1280}>1280px</option><option value={800}>800px</option>
          </select></label>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
        <button type="button" className="tk-btn" onClick={runAll} disabled={!items.length || items.some((i) => i.status === "work")}>
          {items.some((i) => i.status === "work") ? "변환 중…" : `변환하기 (${items.length}장)`}</button>
        <button type="button" className="tk-btn ghost" onClick={saveZip} disabled={done.length < 2}>모두 받기 (ZIP)</button>
        <button type="button" className="tk-btn ghost" onClick={() => { items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview)); setItems([]); files.current.clear(); }}
                disabled={!items.length}>목록 비우기</button>
      </div>

      {done.length > 0 && (
        <p style={{ fontSize: 14, marginTop: 12 }}>
          {kb(before)} → <b>{kb(after)}</b>
          {after < before ? <span style={{ color: "var(--status-live-text)" }}> ({Math.round((1 - after / before) * 100)}% 줄었어요)</span> : null}
        </p>
      )}

      {items.length > 0 && (
        <table className="tk-table">
          <thead><tr><th>파일</th><th className="n">원본</th><th className="n">결과</th><th></th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                  {i.preview ? <img src={i.preview} alt="" width={40} height={40} style={{ objectFit: "cover", borderRadius: 6 }} /> : <span style={{ width: 40 }} />}
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>{i.outName || i.name}</span>
                </td>
                <td className="n">{kb(i.size)}</td>
                <td className="n">{i.status === "done" ? <>{kb(i.out!.size)}<br /><small style={{ color: "var(--text-muted)" }}>{i.w}×{i.h}</small></>
                  : i.status === "work" ? "변환 중…" : i.status === "error" ? <span className="tk-warn">{i.error}</span> : "대기"}</td>
                <td className="n">{i.out && <button type="button" className="tk-btn ghost" style={{ padding: "6px 12px" }} onClick={() => save(i.out!, i.outName!)}>받기</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="tk-note">사진은 서버로 올라가지 않고 이 브라우저 안에서만 변환돼요. HEIC 변환은 처음 한 번 변환 도구(약 1MB)를 내려받아요.</p>
    </div>
  );
}
