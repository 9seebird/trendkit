# -*- coding: utf-8 -*-

from typing import List, Optional, Dict, Any, Set
from pathlib import Path
from io import StringIO, BytesIO
from collections import Counter
from datetime import datetime
from urllib.parse import quote
import os
import re
import html
import csv
import base64
import urllib.parse

import feedparser
from bs4 import BeautifulSoup
from wordcloud import WordCloud

from fastapi import FastAPI, Query, APIRouter
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles


# =========================================================
# 기본 경로 설정
# =========================================================
BASE_DIR = Path(__file__).parent
STATIC_ROOT = BASE_DIR / "static"
STOPWORDS_FILE = BASE_DIR / "stopwords_wordcloud.txt"
FONTS_DIR = STATIC_ROOT / "fonts"


# =========================================================
# 폰트 후보 목록
# - 워드클라우드는 한글 폰트가 반드시 필요
# - 먼저 프로젝트 내부 폰트를 찾고, 없으면 시스템 폰트를 탐색
# =========================================================
FONT_CANDIDATES = [
    str(FONTS_DIR / "NanumGothic.ttf"),
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJKKR-Regular.otf",
    "/usr/share/fonts/truetype/noto/NotoSansKR-Regular.otf",
    "/usr/share/fonts/truetype/noto/NotoSansKR-Regular.ttf",
]


# =========================================================
# 정규식
# =========================================================
URL_RE = re.compile(r"https?://\S+")
HEX_RE = re.compile(r"^[0-9a-fA-F]{3,8}$")
ONLY_NUM_RE = re.compile(r"^\d+$")
DATE_LIKE_RE = re.compile(r"^\d{1,2}(월|일|시|분)$")
SHORT_ENG_RE = re.compile(r"^[A-Za-z]{1,2}$")
ONLY_ENG_RE = re.compile(r"^[A-Za-z]+$")


# =========================================================
# 제목/요약 끝에 붙는 매체명 꼬리표 제거용 패턴
# 예:
# - "비트코인 급등 - Daum"
# - "반도체 회복 | 매일경제"
# =========================================================
SOURCE_SUFFIX_PATTERNS = [
    r"\s*-\s*(Daum|Newsis|Nate|Naver|Yonhap|YNA|Chosunbiz|ZDNet)\s*$",
    r"\s*\|\s*(Daum|Newsis|Nate|Naver|Yonhap|YNA|Chosunbiz|ZDNet)\s*$",
    r"\s*-\s*(뉴시스|연합뉴스|매일경제|조선비즈|지디넷코리아|동아일보|문화일보|한국경제|서울경제|머니투데이|이데일리|아시아경제|세계일보|한겨레|경향신문|국민일보|조선일보|중앙일보|서울신문|노컷뉴스|헤럴드경제|파이낸셜뉴스)\s*$",
    r"\s*\|\s*(뉴시스|연합뉴스|매일경제|조선비즈|지디넷코리아|동아일보|문화일보|한국경제|서울경제|머니투데이|이데일리|아시아경제|세계일보|한겨레|경향신문|국민일보|조선일보|중앙일보|서울신문|노컷뉴스|헤럴드경제|파이낸셜뉴스)\s*$",
]


# =========================================================
# 코드 차원에서 항상 제거할 영문 잡음/매체명
# - lower() 기준으로 비교
# =========================================================
TECH_STOP = {
    "nbsp", "font", "color", "href", "target", "blank",
    "http", "https", "www", "google", "news", "rss",
    "articles", "com", "net", "co", "kr",
    "daum", "newsis", "naver", "nate", "chosunbiz",
    "zdnet", "yonhap", "yna",
    "jtbc", "kbs", "mbc", "mbn", "sbs", "ytn",
}


# =========================================================
# 한글/혼합 표기 매체명 보조 차단
# =========================================================
HARD_BLOCK_TOKENS = {
    "다음", "네이트", "뉴시스", "연합뉴스", "뉴스",
    "매일경제", "조선비즈", "지디넷코리아", "동아일보", "문화일보",
    "한국경제", "서울경제", "머니투데이", "이데일리", "아시아경제",
    "세계일보", "한겨레", "경향신문", "국민일보", "조선일보",
    "중앙일보", "서울신문", "노컷뉴스", "헤럴드경제", "파이낸셜뉴스",
    "채널a", "jtbc", "kbs", "mbc", "mbn", "sbs", "ytn",
}


# =========================================================
# 한글 폰트 찾기
# =========================================================
def find_korean_font() -> Optional[str]:
    """
    사용 가능한 한글 폰트 경로를 찾아 반환합니다.
    """
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return path
    return None


# =========================================================
# 불용어 로드
# - txt 파일은 "한 줄에 하나" 형식 권장
# - 영어 대소문자 문제를 막기 위해 lower()로 통일 저장
# =========================================================
def load_stopwords(extra: Optional[List[str]] = None) -> Set[str]:
    sw: Set[str] = set()

    if STOPWORDS_FILE.exists():
        with open(STOPWORDS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                word = line.strip()
                if word:
                    sw.add(word.lower())

    if extra:
        for word in extra:
            word = word.strip()
            if word:
                sw.add(word.lower())

    return sw


STOPWORDS_BASE = load_stopwords()


# =========================================================
# HTML / 텍스트 정리
# =========================================================
def clean_html(raw_html: str) -> str:
    """
    HTML 엔티티, 태그, URL, 공백 등을 정리하여
    분석 가능한 순수 텍스트로 변환합니다.
    """
    if not raw_html:
        return ""

    text = html.unescape(html.unescape(raw_html))
    soup = BeautifulSoup(text, "html.parser")
    text = soup.get_text(separator=" ", strip=True)

    # URL 제거
    text = URL_RE.sub(" ", text)

    # 공백 정리
    text = re.sub(r"\s+", " ", text).strip()
    return text


def strip_source_suffix(text: str) -> str:
    """
    제목/요약 끝에 붙는 언론사명 꼬리표 제거
    예:
    - "삼성전자 신제품 공개 - Daum"
    - "반도체 경기 회복 | 매일경제"
    """
    if not text:
        return ""

    result = text
    for pattern in SOURCE_SUFFIX_PATTERNS:
        result = re.sub(pattern, "", result, flags=re.IGNORECASE)

    return result.strip()


def remove_source_mentions(text: str, source: str) -> str:
    """
    RSS entry의 source 값을 이용해
    제목/요약 안에 섞인 매체명을 한 번 더 제거합니다.
    """
    if not text:
        return ""

    result = text
    source = (source or "").strip()

    if source:
        result = re.sub(re.escape(source), " ", result, flags=re.IGNORECASE)

    result = re.sub(r"\s+", " ", result).strip()
    return result


# =========================================================
# 노이즈 토큰 판별
# =========================================================
def is_noise_token(token: str) -> bool:
    """
    잡음으로 볼 토큰인지 판별합니다.
    """
    if not token:
        return True

    t = token.strip()
    tl = t.lower()

    # 한 글자 토큰 제거
    if len(t) <= 1:
        return True

    # 숫자만 있는 토큰 제거
    if ONLY_NUM_RE.fullmatch(t):
        return True

    # 날짜형 토큰 제거 (예: 4월, 21일)
    if DATE_LIKE_RE.fullmatch(t):
        return True

    # 짧은 영문 토큰 제거
    # 단, AI는 실제 의미가 있을 수 있어 예외 처리
    if SHORT_ENG_RE.fullmatch(tl) and tl not in {"ai"}:
        return True

    # 순수 영문 토큰 중 기술/매체 잡음 제거
    if ONLY_ENG_RE.fullmatch(t) and tl in TECH_STOP:
        return True

    # HEX처럼 보이는 문자열 제거
    if HEX_RE.fullmatch(t):
        return True

    # 코드 내 하드 차단 토큰
    if t in HARD_BLOCK_TOKENS or tl in HARD_BLOCK_TOKENS:
        return True

    return False


# =========================================================
# 간단 토큰화
# - 형태소 분석기 없이 공백 기준
# - MVP / 간단 뉴스 분석용
# =========================================================
def simple_ko_tokenize(text: str) -> List[str]:
    cleaned = re.sub(r"[^0-9a-zA-Z가-힣\s]", " ", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    tokens = cleaned.split()

    filtered = []
    for token in tokens:
        if is_noise_token(token):
            continue
        filtered.append(token)

    return filtered


# =========================================================
# 구글 뉴스 RSS 수집
# - 검색어가 없으면 일반 뉴스 RSS
# - 검색어가 있으면 검색 RSS
# - 중복 기사 제거
# - 제목/요약 정제 수행
# =========================================================
def fetch_google_news_ko(query: Optional[str], max_items: int = 100) -> List[Dict[str, Any]]:
    if not query:
        rss_url = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"
    else:
        q = urllib.parse.quote(query)
        rss_url = f"https://news.google.com/rss/search?q={q}&hl=ko&gl=KR&ceid=KR:ko"

    feed = feedparser.parse(rss_url)
    items: List[Dict[str, Any]] = []
    seen = set()

    for entry in feed.entries:
        source = getattr(entry, "source", {}).get("title", "") if hasattr(entry, "source") else ""
        source = clean_html(source)

        title = clean_html(entry.get("title", ""))
        summary = clean_html(entry.get("summary", ""))
        link = entry.get("link", "")
        published = entry.get("published", "")

        # 1차: 제목/요약 끝 매체명 꼬리표 제거
        title = strip_source_suffix(title)
        summary = strip_source_suffix(summary)

        # 2차: source 기반으로 매체명 한 번 더 제거
        title = remove_source_mentions(title, source)
        summary = remove_source_mentions(summary, source)

        # 중복 기사 제거
        key = (link.split("?")[0], title)
        if key in seen:
            continue
        seen.add(key)

        items.append({
            "title": title,
            "summary": summary,
            "link": link,
            "published": published,
            "source": source,
        })

        if len(items) >= max_items:
            break

    return items


# =========================================================
# 워드클라우드 생성
# =========================================================
def build_wordcloud(
    tokens: List[str],
    font_path: Optional[str],
    width: int = 1200,
    height: int = 800
):
    """
    토큰 빈도를 기반으로 워드클라우드를 생성합니다.
    """
    freq = Counter(tokens)

    wc = WordCloud(
        width=width,
        height=height,
        background_color="white",
        font_path=font_path
    ).generate_from_frequencies(freq)

    return wc, freq


# =========================================================
# 토큰/빈도 계산
# - 기본은 제목만 분석
# - summary는 잡음이 많아 기본 제외
# - extra_stopwords는 콤마(,) 구분 입력 지원
# =========================================================
def compute_tokens_and_freq(query: str, extra_stopwords: Optional[str], max_items: int):
    items = fetch_google_news_ko(query, max_items=max_items)

    texts: List[str] = []
    for item in items:
        # 제목만 분석
        if item.get("title"):
            texts.append(item["title"])

        # 요약까지 포함하고 싶으면 아래 주석 해제
        # if item.get("summary"):
        #     texts.append(item["summary"])

    raw_text = " ".join(texts)
    tokens = simple_ko_tokenize(raw_text)

    extras = [token.strip() for token in extra_stopwords.split(",")] if extra_stopwords else []
    stopwords = load_stopwords(extras)

    # lower() 기준으로 최종 불용어 제거
    tokens = [token for token in tokens if token.lower() not in stopwords]

    return items, tokens


# =========================================================
# FastAPI 앱 설정
# =========================================================
app = FastAPI(title="WordCloud Service", version="1.0.0")
app.mount("/static", StaticFiles(directory=str(STATIC_ROOT)), name="static")

pages = APIRouter()
api = APIRouter(prefix="/api")

@app.on_event("startup")
async def startup():
    print("### wordcloud server STARTED ###")

# =========================================================
# favicon
# =========================================================
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """
    브라우저 탭 아이콘 반환
    """
    return FileResponse(STATIC_ROOT / "favicon.ico")


# =========================================================
# 정적 페이지 라우트
# =========================================================
@pages.get("/", response_class=FileResponse)
def index():
    return FileResponse(STATIC_ROOT / "wordcloud.html")


@pages.get("/wordcloud", response_class=FileResponse)
def page_wordcloud():
    return FileResponse(STATIC_ROOT / "wordcloud.html")


@pages.get("/privacy", response_class=FileResponse)
def page_privacy():
    return FileResponse(STATIC_ROOT / "privacy.html")


@pages.get("/terms", response_class=FileResponse)
def page_terms():
    return FileResponse(STATIC_ROOT / "terms.html")


@pages.get("/contact", response_class=FileResponse)
def page_contact():
    return FileResponse(STATIC_ROOT / "contact.html")


# =========================================================
# 워드클라우드 API
# =========================================================
@api.get("/wordcloud")
def api_wordcloud(
    query: str = Query(..., description="검색할 키워드"),
    extra_stopwords: Optional[str] = Query(None, description="추가 불용어 (콤마 구분)"),
    width: int = Query(1200, ge=400, le=3000),
    height: int = Query(800, ge=300, le=3000),
    max_items: int = Query(50, ge=10, le=200)
):
    """
    검색어 기반 뉴스 기사에서 워드클라우드를 생성합니다.
    """
    items, tokens = compute_tokens_and_freq(query, extra_stopwords, max_items)

    if not items:
        return JSONResponse(
            {"ok": False, "error": "관련 기사를 찾지 못했습니다."},
            status_code=404
        )

    if not tokens:
        return JSONResponse(
            {"ok": False, "error": "유효한 토큰이 없습니다."},
            status_code=400
        )

    font_path = find_korean_font()
    if not font_path:
        return JSONResponse(
            {"ok": False, "error": "한글 폰트를 찾지 못했습니다."},
            status_code=500
        )

    wc, freq = build_wordcloud(tokens, font_path, width, height)

    # PIL 이미지 → PNG 바이트 변환
    img_pil = wc.to_image()
    img_io = BytesIO()
    img_pil.save(img_io, format="PNG")
    img_io.seek(0)

    # 프론트에서 바로 표시할 수 있도록 base64로 변환
    img_base64 = base64.b64encode(img_io.getvalue()).decode("utf-8")

    # 상위 빈도 100개 반환
    top_freq = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:100]

    return JSONResponse({
        "ok": True,
        "image_data": f"data:image/png;base64,{img_base64}",
        "query": query,
        "count_articles": len(items),
        "count_tokens": len(tokens),
        "top_freq": [{"token": token, "count": count} for token, count in top_freq],
    })


# =========================================================
# 빈도 CSV 내보내기
# =========================================================
@api.get("/export/frequencies.csv")
def export_frequencies_csv(
    query: str = Query(...),
    extra_stopwords: Optional[str] = Query(None),
    max_items: int = Query(50, ge=10, le=200)
):
    """
    상위 토큰 빈도를 CSV로 다운로드합니다.
    """
    _, tokens = compute_tokens_and_freq(query, extra_stopwords, max_items)
    freq = Counter(tokens)
    top_freq = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:100]

    csv_io = StringIO()
    writer = csv.writer(csv_io)
    writer.writerow(["토큰", "빈도"])
    writer.writerows(top_freq)

    csv_bytes = csv_io.getvalue().encode("utf-8-sig")

    date_str = datetime.now().strftime("%Y%m%d")
    ascii_name = f"frequencies_{date_str}.csv"
    utf8_name = f"frequencies_{date_str}_{query}.csv"
    encoded_utf8_name = quote(utf8_name, safe="")

    headers = {
        "Content-Disposition": f"attachment; filename={ascii_name}; filename*=UTF-8''{encoded_utf8_name}"
    }

    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv; charset=utf-8",
        headers=headers
    )


# =========================================================
# 기사 원문 목록 CSV 내보내기
# =========================================================
@api.get("/export/articles.csv")
def export_articles_csv(
    query: str = Query(...),
    max_items: int = Query(50, ge=10, le=200)
):
    """
    수집한 기사 목록(title, summary, link, source, published)을 CSV로 다운로드합니다.
    """
    items = fetch_google_news_ko(query, max_items=max_items)

    csv_io = StringIO()
    fieldnames = ["title", "summary", "link", "source", "published"]
    writer = csv.DictWriter(csv_io, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(items)

    csv_bytes = csv_io.getvalue().encode("utf-8-sig")

    date_str = datetime.now().strftime("%Y%m%d")
    ascii_name = f"articles_{date_str}.csv"
    utf8_name = f"articles_{date_str}_{query}.csv"
    encoded_utf8_name = quote(utf8_name, safe="")

    headers = {
        "Content-Disposition": f"attachment; filename={ascii_name}; filename*=UTF-8''{encoded_utf8_name}"
    }

    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv; charset=utf-8",
        headers=headers
    )

# =========================================================
# 라우터 등록
# =========================================================
app.include_router(pages)
app.include_router(api)