#!/usr/bin/env python3
"""
Pulls the theory-exam question banks that training-driving.com embeds in each of
its practice-test posts and writes them to scripts/scraped-questions.json.

Each post renders its quiz from an inline `var qw_questions = [...]` literal, so
no browser or API is needed: fetch the HTML, bracket-match the array, parse it.

Usage:  python3 scripts/scrape-questions.py
"""

from __future__ import annotations

import html
import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SITEMAP = "https://www.training-driving.com/sitemap.xml"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)
OUT = Path(__file__).parent / "scraped-questions.json"

# Only posts that actually host a quiz; the blog also holds coach profiles,
# news and article pages that would just be 400 wasted requests.
QUIZ_URL = re.compile(
    r"(driving-test|examination-questions|exam-questions|animation-questions|test-motorcycles)"
)


def model_id(url: str) -> str:
    """`.../theoretical-driving-test-class-4-5-6-part2.html` -> `class-4-5-6-part2`."""
    slug = url.rsplit("/", 1)[-1].removesuffix(".html")
    slug = slug.replace("theoretical-test-motorcycles-2025-part", "moto-part")
    return slug.replace("theoretical-driving-test-", "")


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.read().decode("utf-8", errors="replace")


def sitemap_urls() -> list[str]:
    xml = fetch(SITEMAP)
    return [u for u in re.findall(r"<loc>(.*?)</loc>", xml) if QUIZ_URL.search(u)]


def match_array(text: str, start: int) -> str | None:
    """Slice the JS array literal beginning at `start`, ignoring brackets that
    live inside string values (Arabic answers contain both quotes and brackets)."""
    depth = 0
    in_str = False
    quote = ""
    escaped = False
    for i in range(start, len(text)):
        ch = text[i]
        if in_str:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                in_str = False
            continue
        if ch in "\"'":
            in_str, quote = True, ch
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def repair(raw: str) -> str:
    """The hand-written source literals contain a few typos that are illegal in
    strict JSON: stray backslashes inside Arabic text and trailing commas."""
    raw = re.sub(r"\\u(?![0-9a-fA-F]{4})", "u", raw)
    raw = re.sub(r'\\(?![\\"/bfnrtu])', "", raw)
    return re.sub(r",\s*([\]}])", r"\1", raw)


def parse_array(raw: str) -> list[dict]:
    raw = html.unescape(raw)
    for attempt in (raw, repair(raw)):
        try:
            data = json.loads(attempt)
        except json.JSONDecodeError as err:
            last = err
            continue
        return [q for q in data if isinstance(q, dict)]
    print(f"  parse failed: {last}", file=sys.stderr)
    return []


def extract(url: str) -> list[dict]:
    try:
        page = fetch(url)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as err:
        print(f"  skip {url}: {err}", file=sys.stderr)
        return []

    out: list[dict] = []
    for m in re.finditer(r"qw_questions\s*=\s*", page):
        bracket = page.find("[", m.end())
        if bracket == -1:
            continue
        raw = match_array(page, bracket)
        if raw:
            for q in parse_array(raw):
                q["_source"] = url
                out.append(q)
    return out


def main() -> None:
    urls = sitemap_urls()
    print(f"scanning {len(urls)} candidate quiz pages")

    collected: list[dict] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        for i, batch in enumerate(pool.map(extract, urls), 1):
            collected.extend(batch)
            if i % 25 == 0:
                print(f"  {i}/{len(urls)} pages — {len(collected)} questions so far")

    # Dedupe on question text + answer set: a handful of questions are reused
    # across practice tests. We keep one canonical copy but remember every
    # model it belongs to, so each exam model can be rebuilt exactly.
    index: dict[str, int] = {}
    questions: list[dict] = []
    models: dict[str, list[int]] = {}

    for q in collected:
        text = re.sub(r"\s+", " ", str(q.get("question", ""))).strip()
        if not text:
            continue
        answers = [a for a in q.get("answers", []) if isinstance(a, dict)]
        key = text + "||" + "|".join(str(a.get("answer", "")).strip() for a in answers)

        if key not in index:
            index[key] = len(questions)
            questions.append(
                {
                    "question": text,
                    "image": str(q.get("image", "")).strip(),
                    "answers": [
                        {"answer": str(a.get("answer", "")).strip(), "right": bool(a.get("right"))}
                        for a in answers
                    ],
                }
            )
        models.setdefault(model_id(q["_source"]), []).append(index[key])

    payload = {"questions": questions, "models": models}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(collected)} scraped, {len(questions)} unique across {len(models)} models -> {OUT}")


if __name__ == "__main__":
    main()
