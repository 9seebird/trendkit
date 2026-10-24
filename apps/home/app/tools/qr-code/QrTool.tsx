"use client";

import { useEffect, useMemo, useState } from "react";
import { LIBS, loadScript } from "@/lib/loadScript";

type QR = { addData(s: string, mode?: string): void; make(): void; getModuleCount(): number; isDark(r: number, c: number): boolean };
declare global {
  interface Window {
    qrcode?: ((type: number, level: "L" | "M" | "Q" | "H") => QR) & { stringToBytes: unknown; stringToBytesFuncs: Record<string, unknown> };
  }
}
type Kind = "url" | "text" | "wifi";
const esc = (s: string) => s.replace(/([\;,:"])/g, "\\$1");   // 와이파이 QR 형식의 특수문자

export default function QrTool() {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [kind, setKind] = useState<Kind>("url");
  const [url, setUrl] = useState("https://trendkit.app");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [pw, setPw] = useState("");
  const [sec, setSec] = useState("WPA");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");

  useEffect(() => {
    loadScript(LIBS.qrcode).then(() => {
      // 한글이 깨지지 않게 UTF-8 로 바꿔 넣는다
      const q = window.qrcode!;
      q.stringToBytes = q.stringToBytesFuncs["UTF-8"];
      setReady(true);
    }).catch((e) => setErr(e.message));
  }, []);

  const data = kind === "url" ? url.trim()
    : kind === "text" ? text
    : ssid ? `WIFI:T:${sec === "nopass" ? "nopass" : sec};S:${esc(ssid)};${sec === "nopass" ? "" : `P:${esc(pw)};`};` : "";

  const qr = useMemo(() => {
    if (!ready || !data) return null;
    try {
      const q = window.qrcode!(0, level);
      q.addData(data, "Byte"); q.make();
      return q;
    } catch { return null; }
  }, [ready, data, level]);

  const svg = useMemo(() => {
    if (!qr) return "";
    const n = qr.getModuleCount(), m = 4, size = n + m * 2;
    let path = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) path += `M${c + m} ${r + m}h1v1h-1z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
      `<rect width="100%" height="100%" fill="${bg}"/><path d="${path}" fill="${fg}"/></svg>`;
  }, [qr, fg, bg]);

  function download(type: "png" | "svg") {
    if (!svg) return;
    const name = `qrcode.${type}`;
    if (type === "svg") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); a.download = name; a.click();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 1024;
      const ctx = c.getContext("2d")!; ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, 1024, 1024);
      c.toBlob((b) => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; a.click(); });
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  return (
    <div className="tk-panel">
      <div className="tk-seg" style={{ marginBottom: 16 }}>
        {([["url", "링크"], ["text", "글"], ["wifi", "와이파이"]] as [Kind, string][]).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px", gap: 20 }} className="tk-qr-grid">
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          {kind === "url" && <label className="tk-field"><span>링크 주소</span>
            <input className="tk-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" inputMode="url" /></label>}
          {kind === "text" && <label className="tk-field"><span>글 (연락처, 안내 문구 등)</span>
            <textarea className="tk-textarea" style={{ minHeight: 120 }} value={text} onChange={(e) => setText(e.target.value)} /></label>}
          {kind === "wifi" && <>
            <label className="tk-field"><span>와이파이 이름 (SSID)</span><input className="tk-input" value={ssid} onChange={(e) => setSsid(e.target.value)} /></label>
            <label className="tk-field"><span>비밀번호</span><input className="tk-input" value={pw} onChange={(e) => setPw(e.target.value)} disabled={sec === "nopass"} /></label>
            <label className="tk-field"><span>보안 방식</span>
              <select className="tk-select" value={sec} onChange={(e) => setSec(e.target.value)}>
                <option value="WPA">WPA/WPA2/WPA3 (대부분)</option><option value="WEP">WEP</option><option value="nopass">비밀번호 없음</option>
              </select></label>
          </>}
          <div className="tk-row">
            <label className="tk-field"><span>QR 색</span><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} style={{ height: 40, width: "100%" }} /></label>
            <label className="tk-field"><span>배경 색</span><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ height: 40, width: "100%" }} /></label>
            <label className="tk-field"><span>오류 복원</span>
              <select className="tk-select" value={level} onChange={(e) => setLevel(e.target.value as "L" | "M" | "Q" | "H")}>
                <option value="L">낮음 (7%)</option><option value="M">보통 (15%)</option><option value="Q">높음 (25%)</option><option value="H">최고 (30%)</option>
              </select></label>
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 10, background: bg, aspectRatio: "1", display: "grid", placeItems: "center" }}
               dangerouslySetInnerHTML={{ __html: svg || `<span style="color:#999;font-size:13px">${err || (ready ? "내용을 입력하세요" : "준비 중…")}</span>` }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button type="button" className="tk-btn" style={{ flex: 1 }} onClick={() => download("png")} disabled={!svg}>PNG 저장</button>
            <button type="button" className="tk-btn ghost" style={{ flex: 1 }} onClick={() => download("svg")} disabled={!svg}>SVG</button>
          </div>
        </div>
      </div>
      <p className="tk-note">QR 코드는 이 브라우저에서 만들어지고, 넣은 내용(와이파이 비밀번호 포함)은 서버로 보내지 않아요. 만든 QR은 기간 제한 없이 계속 쓸 수 있어요. 인쇄 전에는 휴대폰으로 한 번 찍어 확인하세요.</p>
      <style>{`@media (max-width: 640px){ .tk-qr-grid{ grid-template-columns: minmax(0,1fr) !important; } }`}</style>
    </div>
  );
}
