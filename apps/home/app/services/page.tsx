import { permanentRedirect } from "next/navigation";

// 서비스 목록은 '도구'(/tools) 한 곳으로 합쳤다. 예전 링크·검색 결과는 그쪽으로 보낸다.
export default function ServicesPage() {
  permanentRedirect("/tools");
}
