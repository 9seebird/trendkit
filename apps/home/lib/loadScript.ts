// 무거운 라이브러리(HEIC 변환, ZIP, QR)는 그 도구를 쓸 때만 CDN 에서 불러온다.
// 페이지 첫 로딩을 가볍게 하고, 패키지를 늘리지 않으려고.
const loading = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("browser only"));
  if (!loading.has(src)) {
    loading.set(src, new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { loading.delete(src); reject(new Error(`스크립트를 불러오지 못했어요: ${src}`)); };
      document.head.appendChild(s);
    }));
  }
  return loading.get(src)!;
}

export const LIBS = {
  heic2any: "https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js",
  jszip: "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
  qrcode: "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js",
};
