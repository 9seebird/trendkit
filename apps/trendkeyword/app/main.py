# -*- coding: utf-8 -*-

from typing import List, Optional, Dict, Any, Set
from pathlib import Path
from collections import Counter
from datetime import datetime, timedelta
import os
import re
import html

import requests
import feedparser
from bs4 import BeautifulSoup

from fastapi import FastAPI, Query, APIRouter, Response
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles


# =========================================================
# 기본 설정
# =========================================================
MAX_LIMIT = 600
CACHE_DURATION = timedelta(minutes=30)

BASE_DIR = Path(__file__).parent
STATIC_ROOT = BASE_DIR / "static"
STOPWORDS_FILE = BASE_DIR / "stopwords_trend.txt"

GOOGLE_NEWS_BASE = "https://news.google.com/rss"
COMMON_QS = "?hl=ko&gl=KR&ceid=KR:ko"

SECTION_URLS = [
    f"{GOOGLE_NEWS_BASE}/headlines{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/WORLD{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/NATION{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/BUSINESS{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/TECHNOLOGY{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/SCIENCE{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/HEALTH{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/SPORTS{COMMON_QS}",
    f"{GOOGLE_NEWS_BASE}/headlines/section/topic/ENTERTAINMENT{COMMON_QS}",
]

trend_cache: dict[int, dict] = {}


# =========================================================
# 정규식
# =========================================================
URL_RE = re.compile(r"https?://\S+")
HEX_RE = re.compile(r"^[0-9a-fA-F]{3,8}$")
ONLY_ENG_RE = re.compile(r"^[A-Za-z]+$")
ONLY_NUM_RE = re.compile(r"^\d+$")
DATE_LIKE_RE = re.compile(r"^\d{1,2}(월|일|시|분)$")
SHORT_ENG_RE = re.compile(r"^[A-Za-z]{1,2}$")

# 제목 끝에 붙는 매체명 / 플랫폼 꼬리표 제거용
SOURCE_SUFFIX_PATTERNS = [
    r"\s*-\s*(Daum|Newsis|Nate|Naver|Yonhap|YNA|Chosunbiz|ZDNet)\s*$",
    r"\s*\|\s*(Daum|Newsis|Nate|Naver|Yonhap|YNA|Chosunbiz|ZDNet)\s*$",
    r"\s*-\s*(뉴시스|연합뉴스|매일경제|조선비즈|지디넷코리아|동아일보|문화일보|한국경제|서울경제|머니투데이|이데일리|아시아경제|세계일보|한겨레|경향신문|국민일보|조선일보|중앙일보|서울신문|노컷뉴스|헤럴드경제|파이낸셜뉴스)\s*$",
    r"\s*\|\s*(뉴시스|연합뉴스|매일경제|조선비즈|지디넷코리아|동아일보|문화일보|한국경제|서울경제|머니투데이|이데일리|아시아경제|세계일보|한겨레|경향신문|국민일보|조선일보|중앙일보|서울신문|노컷뉴스|헤럴드경제|파이낸셜뉴스)\s*$",
]


# =========================================================
# 코드 내 기본 차단 단어
# - stopwords_ko.txt 외에, 코드 차원에서 항상 제거할 것들
# - 영어는 lower() 기준으로 비교
# =========================================================
TECH_STOP = {
    "nbsp", "font", "color", "href", "target", "blank",
    "http", "https", "www", "google", "news", "rss",
    "articles", "com", "net", "co", "kr",
    "daum", "newsis", "naver", "nate", "chosunbiz",
    "zdnet", "yonhap", "yna",
    "jtbc", "kbs", "mbc", "mbn", "sbs", "ytn",
}

# 한국어/영어 혼합으로 자주 섞이는 플랫폼/매체명 보조 차단
HARD_BLOCK_TOKENS = {
    "다음", "네이트", "뉴시스", "연합뉴스", "뉴스",
    "매일경제", "조선비즈", "지디넷코리아", "동아일보", "문화일보",
    "한국경제", "서울경제", "머니투데이", "이데일리", "아시아경제",
    "세계일보", "한겨레", "경향신문", "국민일보", "조선일보",
    "중앙일보", "서울신문", "노컷뉴스", "헤럴드경제", "파이낸셜뉴스",
    "채널a", "jtbc", "kbs", "mbc", "mbn", "sbs", "ytn",
}


# =========================================================
# 불용어 로드
# - txt 파일은 "한 줄에 하나"가 가장 안전
# - 영어는 소문자로도 함께 저장해서 비교 안정성 향상
# =========================================================
def load_stopwords() -> set:
    sw = set()
    if STOPWORDS_FILE.exists():
        with open(STOPWORDS_FILE, "r", encoding="utf-8") as f:
            for line in f:
                w = line.strip()
                if w:
                    sw.add(w.lower())   # 🔥 핵심
    return sw


STOPWORDS_BASE = load_stopwords()


# =========================================================
# HTML/텍스트 정리
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
    제목/요약 끝에 붙는 언론사 꼬리표 제거
    예:
    - "비트코인 급등 - Daum"
    - "반도체 회복 | 매일경제"
    """
    if not text:
        return ""

    result = text
    for pattern in SOURCE_SUFFIX_PATTERNS:
        result = re.sub(pattern, "", result, flags=re.IGNORECASE)

    return result.strip()


def remove_source_mentions(text: str, source: str) -> str:
    """
    RSS entry의 source 값을 이용해서
    제목/요약에 섞인 매체명을 한 번 더 제거합니다.
    """
    if not text:
        return ""

    result = text
    source = (source or "").strip()

    if source:
        # 원문 source 제거
        result = result.replace(source, " ")

        # 소문자 비교용
        result = re.sub(re.escape(source.lower()), " ", result.lower(), flags=re.IGNORECASE)

    result = re.sub(r"\s+", " ", result).strip()
    return result


# =========================================================
# 토큰 필터
# =========================================================
def is_noise_token(token: str) -> bool:
    """
    이상한 키워드 / 잡음 토큰 여부 판정
    """
    if not token:
        return True

    t = token.strip()
    tl = t.lower()

    # 길이 너무 짧은 것 제외
    if len(t) <= 1:
        return True

    # 숫자만 있는 토큰 제외
    if ONLY_NUM_RE.fullmatch(t):
        return True

    # 날짜형 토큰 제외 (예: 4월, 21일)
    if DATE_LIKE_RE.fullmatch(t):
        return True

    # 짧은 영문 토큰 제외 (AI 같은 건 예외 처리 가능)
    if SHORT_ENG_RE.fullmatch(tl) and tl not in {"ai"}:
        return True

    # 순수 영문 토큰이면서 하드 차단/기술 차단이면 제외
    if ONLY_ENG_RE.fullmatch(t):
        if tl in TECH_STOP or tl in HARD_BLOCK_TOKENS:
            return True

    # HEX 비슷한 문자열 제거
    if HEX_RE.fullmatch(t):
        return True

    # 불용어 파일 기반 제거
    if tl in STOPWORDS_BASE:
        return True

    # 코드 내 하드 차단
    if t in HARD_BLOCK_TOKENS or tl in HARD_BLOCK_TOKENS:
        return True

    return False


def simple_ko_tokenize(text: str) -> List[str]:
    """
    매우 단순한 한국어/영문 토큰화
    - 형태소 분석기 없이 공백 기반으로 자름
    - 뉴스 키워드 MVP 용도
    """
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
# RSS 수집
# =========================================================
# =========================================================
# 네이버 뉴스 검색 API 설정
# Render 환경변수에 아래 두 값을 등록하세요:
#   NAVER_CLIENT_ID
#   NAVER_CLIENT_SECRET
# =========================================================
NAVER_CLIENT_ID = os.environ.get("NAVER_CLIENT_ID", "")
NAVER_CLIENT_SECRET = os.environ.get("NAVER_CLIENT_SECRET", "")

# 트렌드 키워드 서비스에서 사용할 검색어 목록
# 다양한 키워드로 수집해서 종합 트렌드를 만듭니다
TREND_QUERIES = ["뉴스", "정치", "경제", "사회", "연예", "스포츠", "기술", "국제"]

# 네이버 뉴스 검색 API 제한값
NAVER_API_DISPLAY_MAX = 100
NAVER_API_START_MAX = 1000


def normalize_article_key(link: str, title: str) -> str:
    """
    검색어가 달라도 같은 기사가 중복 집계되지 않도록
    원문 링크를 우선으로 정규화하고, 링크가 없으면 제목을 기준으로 중복 제거합니다.
    """
    link = (link or "").strip()
    title = re.sub(r"\s+", " ", (title or "").strip())

    if link:
        # 흔한 추적 파라미터 제거
        link = re.sub(r"[?&](utm_[^=&]+|fbclid|gclid|ocid)=[^&]+", "", link)
        link = link.rstrip("?&")
        return link

    return title.lower()


def fetch_naver_news_multi_queries(max_total: int = 200) -> List[Dict[str, Any]]:
    """
    네이버 뉴스 검색 API로 여러 키워드의 기사를 수집합니다.

    개선점:
    - 각 검색어마다 start=1 한 페이지만 보던 문제를 수정해 페이지네이션합니다.
    - 검색어별 목표 수량보다 조금 넉넉히 가져와 중복 제거 후 max_total에 최대한 맞춥니다.
    - originallink를 우선 사용해 중복 제거 정확도를 높입니다.
    """
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        print("### NAVER API KEY 미설정 ###")
        return []

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    }

    items: List[Dict[str, Any]] = []
    seen: Set[str] = set()

    # 검색어가 겹치므로 중복 제거 후에도 목표 기사 수에 가까워지도록 넉넉히 요청합니다.
    per_query_target = max(30, (max_total // max(1, len(TREND_QUERIES))) + 30)

    for query in TREND_QUERIES:
        if len(items) >= max_total:
            break

        collected_for_query = 0
        start = 1

        while (
            len(items) < max_total
            and collected_for_query < per_query_target
            and start <= NAVER_API_START_MAX
        ):
            display = min(NAVER_API_DISPLAY_MAX, per_query_target - collected_for_query)
            if display <= 0:
                break

            try:
                resp = requests.get(
                    "https://openapi.naver.com/v1/search/news.json",
                    headers=headers,
                    params={
                        "query": query,
                        "display": display,
                        "start": start,
                        "sort": "date",
                    },
                    timeout=15,
                )
                resp.raise_for_status()
                data = resp.json()
            except Exception as e:
                print(f"### Naver News fetch error ({query}, start={start}): {e}")
                break

            api_items = data.get("items", [])
            if not api_items:
                break

            for item in api_items:
                title = clean_html(item.get("title", ""))
                summary = clean_html(item.get("description", ""))
                link = item.get("originallink") or item.get("link", "")
                published = item.get("pubDate", "")

                title = strip_source_suffix(title)
                summary = strip_source_suffix(summary)

                key = normalize_article_key(link, title)
                if not key or key in seen:
                    continue
                seen.add(key)

                items.append({
                    "title": title,
                    "summary": summary,
                    "link": link,
                    "published": published,
                    "source": "",
                    "query": query,
                })

                if len(items) >= max_total:
                    break

            collected_for_query += len(api_items)

            # 네이버 검색 API는 다음 페이지가 start + display 입니다.
            start += display

            # 마지막 페이지이면 종료합니다.
            total = int(data.get("total", 0) or 0)
            if start > total:
                break

    return items[:max_total]


# 기존 함수명을 참조하는 코드가 있어도 동작하도록 호환용 별칭을 둡니다.
def fetch_google_news_multi_sections(max_total: int = 200) -> List[Dict[str, Any]]:
    return fetch_naver_news_multi_queries(max_total=max_total)


# =========================================================
# 키워드 계산
# =========================================================
def compute_trends(limit: int):
    """
    키워드 계산 로직

    변경 포인트:
    - 제목 중심 분석
    - summary는 잡음이 많아서 기본적으로 제외
    - 필요하면 아래 주석 부분 활성화 가능
    """
    items = fetch_naver_news_multi_queries(max_total=limit)

    texts: List[str] = []

    for item in items:
        # 제목 중심으로 분석
        if item.get("title"):
            texts.append(item["title"])

        # 요약까지 넣고 싶으면 아래 주석 해제
        # 단, 잡음이 늘어날 가능성이 큼
        # if item.get("summary"):
        #     texts.append(item["summary"])

    raw_text = " ".join(texts)

    tokens = simple_ko_tokenize(raw_text)
    freq = Counter(tokens)

    top50 = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:50]
    top20 = top50[:20]

    return {
        "items_count": len(items),
        "tokens_count": len(tokens),
        "top50": [{"token": token, "count": count} for token, count in top50],
        "series20": [{"token": token, "count": count} for token, count in top20],
    }


# =========================================================
# FastAPI 앱 설정
# =========================================================
app = FastAPI(title="Trend Keyword Service", version="1.0.0")
app.mount("/static", StaticFiles(directory=str(STATIC_ROOT)), name="static")

pages = APIRouter()
api = APIRouter(prefix="/api")

@app.on_event("startup")
async def startup():
    print("### trendkeyword server STARTED ###")

# =========================================================
# favicon
# =========================================================
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    """
    브라우저 탭 아이콘 제공
    """
    return FileResponse(STATIC_ROOT / "favicon.ico")


# =========================================================
# 정적 페이지 라우트
# =========================================================
@pages.get("/", response_class=FileResponse)
def index():
    return FileResponse(STATIC_ROOT / "trends.html")


@pages.get("/trends", response_class=FileResponse)
def page_trends():
    return FileResponse(STATIC_ROOT / "trends.html")


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
# API
# =========================================================
@api.get("/trends")
def api_trends(
    limit: int = Query(200, ge=50, le=1000),
    _t: Optional[str] = None,
    response: Response = None,
):
    """
    트렌드 키워드 API

    query params
    - limit: 분석할 기사 수
    - _t=force: 캐시 무시하고 강제 새로고침
    """
    now = datetime.utcnow()
    limit = min(limit, MAX_LIMIT)
    force = (_t == "force")

    entry = trend_cache.get(limit)
    if entry and not force and (now - entry["fetch_time"] < CACHE_DURATION):
        data = entry["data"]
        cached = True
    else:
        data = compute_trends(limit)
        trend_cache[limit] = {
            "data": data,
            "fetch_time": now
        }
        cached = False

    # 브라우저 캐시 방지
    if response is not None:
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

    if data["items_count"] == 0:
        return JSONResponse(
            {"ok": False, "error": "관련 기사를 찾지 못했습니다."},
            status_code=404
        )

    if data["tokens_count"] == 0:
        return JSONResponse(
            {"ok": False, "error": "유효한 토큰이 없습니다."},
            status_code=400
        )

    return {
        "ok": True,
        "cached": cached,
        "force": force,
        "limit_used": limit,
        **data,
        "fetched_at": trend_cache[limit]["fetch_time"].isoformat() + "Z",
    }


app.include_router(pages)
app.include_router(api)

# =========================================================
# 시작 시 워밍업
# =========================================================
@app.on_event("startup")
async def warmup():
    """
    서버 시작 시 기본 limit=200 캐시를 미리 생성
    첫 요청 응답속도를 조금 줄여줍니다.
    """
    try:
        trend_cache[200] = {
            "data": compute_trends(200),
            "fetch_time": datetime.utcnow()
        }
        print("[warmup] trends cache primed")
    except Exception as e:
        print("[warmup] error:", e)