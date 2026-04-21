# TrendKit — 모노레포 구조

> GitHub → Vercel(프론트) + Render(백엔드) 배포 구조

---

## 📁 폴더 구조

```
/
├── apps/
│   ├── home/           # Next.js 메인 사이트 (Vercel 배포)
│   ├── excel-merger/   # Next.js Excel 병합 도구 (Vercel 배포)
│   ├── trendkeyword/   # FastAPI 키워드 트렌드 (Render 배포)
│   └── wordcloud/      # FastAPI 워드클라우드 (Render 배포)
├── packages/
│   └── config/         # 공유 Tailwind 설정
├── package.json        # 루트 워크스페이스
└── .env.local          # 로컬 환경변수 (git 제외)
```

---

## 🏠 apps/home 구조 (메인 사이트)

```
apps/home/
├── app/
│   ├── _components/
│   │   ├── Header/        # 네비게이션 헤더 (현재 페이지 굵게 표시)
│   │   ├── Footer/        # 푸터
│   │   └── BackButton/    # 뒤로가기 버튼 (서브페이지 공통)
│   ├── about/             # /about 페이지
│   ├── contact/           # /contact 페이지 (공지 + 고객 요청)
│   ├── services/          # /services 페이지
│   ├── layout.tsx         # 루트 레이아웃 (메타데이터, 폰트)
│   └── page.tsx           # 홈페이지 (/)
├── lib/
│   └── urls.ts            # ★ 서비스 URL 단일 관리 파일
├── styles/
│   └── globals.css        # ★ 디자인 토큰 단일 관리 파일
└── .env.local             # 로컬 환경변수
```

---

## ✏️ 자주 수정하는 위치

| 수정 내용 | 파일 |
|-----------|------|
| 서비스 URL 변경 | `apps/home/lib/urls.ts` |
| 색상·폰트·간격 변경 | `apps/home/styles/globals.css` |
| 메뉴 항목 추가·수정 | `apps/home/app/_components/Header/index.tsx` → `NAV_ITEMS` |
| 공지사항 추가 | `apps/home/app/contact/page.tsx` → `NOTICES` |
| 서비스 도구 추가 | `apps/home/app/services/page.tsx` → `TOOLS` |
| SEO 메타데이터 | `apps/home/app/layout.tsx` → `metadata` |
| 푸터 링크 수정 | `apps/home/app/_components/Footer/index.tsx` → `FOOTER_LINKS` |

---

## 🚀 배포 구조

### Vercel (프론트엔드)
- `apps/home` → `trendkit.app`
- `apps/excel-merger` → `excel.trendkit.app`

**Vercel 환경변수 설정 (각 프로젝트 대시보드에서)**
```
NEXT_PUBLIC_URL_HOME=https://trendkit.app
NEXT_PUBLIC_URL_EXCEL=https://excel.trendkit.app
NEXT_PUBLIC_URL_WORDCLOUD=https://wordcloud.trendkit.app
NEXT_PUBLIC_URL_TRENDS=https://keywords.trendkit.app
```

### Render (백엔드 Python)
- `apps/trendkeyword` → `keywords.trendkit.app`
- `apps/wordcloud` → `wordcloud.trendkit.app`

---

## 💻 로컬 개발

```bash
# 루트에서 모든 앱 설치
npm install

# home 앱 단독 실행
cd apps/home
npm run dev   # http://localhost:3000

# excel-merger 앱 단독 실행
cd apps/excel-merger
npm run dev   # http://localhost:3001
```

**로컬 환경변수 (`apps/home/.env.local`)**
```
NEXT_PUBLIC_URL_HOME=http://localhost:3000
NEXT_PUBLIC_URL_EXCEL=http://localhost:3001
NEXT_PUBLIC_URL_WORDCLOUD=http://localhost:8001
NEXT_PUBLIC_URL_TRENDS=http://localhost:8002
```
