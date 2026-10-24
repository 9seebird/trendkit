import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 서비스 목록을 /tools 로 합쳤다 (예전 링크·검색 결과 유지)
  async redirects() {
    return [{ source: "/services", destination: "/tools", permanent: true }];
  },
  // 다른 앱(excel-merger 등) 서브도메인으로 배포할 때
  // rewrites나 redirects 여기서 관리 가능
};

export default nextConfig;
