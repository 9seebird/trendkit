// /ads.txt — 구글 애드센스 '승인된 판매자' 확인 파일.
// 게시자 ID 는 이미 쓰는 환경변수(NEXT_PUBLIC_ADSENSE_CLIENT_ID = ca-pub-…)에서 만든다.
// trendkit.app 의 ads.txt 하나로 하위 도메인(pdf·excel·wordcloud·keywords·trip)까지 인정된다.
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const pub = client.replace(/^ca-/, "");
  const body = pub.startsWith("pub-")
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# NEXT_PUBLIC_ADSENSE_CLIENT_ID 가 설정되지 않았습니다\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
