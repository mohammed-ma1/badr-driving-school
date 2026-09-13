#!/usr/bin/env python3
"""
Turns scripts/scraped-questions.json into src/app/core/data/exam-bank.ts.

The source exams carry no topic labels, so each question is tagged here with a
weighted keyword vote across the four topics the app filters by. `rules` is the
fallback because it is the broadest category in the Jordanian syllabus.

Usage:  python3 scripts/build-questions.py
"""

from __future__ import annotations

import json
import re
from pathlib import Path

SRC = Path(__file__).parent / "scraped-questions.json"
OUT = Path(__file__).parent.parent / "src/app/core/data/exam-bank.ts"
BASE_ID = 1001

ORDINALS = [
    "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس",
    "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر",
]

# (weight, keywords). Higher weight wins ties against broad rule vocabulary.
TOPIC_KEYWORDS: dict[str, list[tuple[int, list[str]]]] = {
    "safety": [
        (5, ["إسعاف", "الإسعافات", "نزيف", "كسور", "الكسور", "حروق", "الحروق", "جرح", "جروح",
             "إغماء", "الإغماء", "غيبوبة", "الصدمة", "إختناق", "اختناق", "التنفس الاصطناعي",
             "تدليك القلب", "ضربات الشمس", "ضربة شمس", "تشنج", "الإجهاد الحراري", "ضمادة",
             "جبيرة", "تسمم", "المصاب", "مصاب", "الحروق"]),
        (4, ["حزام الأمان", "الوسادة الهوائية", "كرسي الأطفال", "مقعد الأطفال", "النقطة العمياء",
             "المثلث العاكس", "مسافة الأمان", "مسافة أمان", "قاعدة الثلاث", "الانزلاق", "انزلاق",
             "النعاس", "الإرهاق", "التعب", "الكحول", "المخدرات", "مطفأة", "الحرائق"]),
        (2, ["السلامة", "حادث", "الحادث", "حوادث", "خطر", "الخطر", "الطوارئ", "الإسعاف"]),
    ],
    "vehicle": [
        (5, ["المحرك", "محرك", "الزيت", "زيت", "الإطار", "الإطارات", "إطار", "الفرامل", "المكابح",
             "البطارية", "بطارية", "مبدل السرعة", "ناقل الحركة", "الرديتر", "المشع", "التبريد",
             "الوقود", "البنزين", "الديزل", "شمعات", "المولد", "الدينمو", "القابض", "الكلتش",
             "المساحات", "العادم", "التعليق", "المسننات", "الهيدروليك", "الشاحن", "الرادياتير",
             "الديفرنشل", "عمود الكردان", "الصدمات", "الزنبرك", "الحرارة", "الشنبر", "البوجيهات"]),
        (3, ["الصيانة", "الفحص الدوري", "ضغط الهواء", "لوحة العدادات", "المؤشر", "الأنوار",
             "المصابيح", "العجلات", "العجل", "الكهربائي", "استهلاك"]),
    ],
    "signs": [
        (5, ["الشاخصة", "شاخصة", "الشواخص", "شواخص", "هذه الإشارة", "الإشارة المرورية",
             "الإشارات المرورية", "الإشارة الضوئية", "الإشارات الضوئية", "اللوحة", "لوحة",
             "الخطوط الأرضية", "الخط الأبيض", "الخط الأصفر", "الخط المتصل", "الخط المتقطع",
             "المثلث المقلوب", "هذا الشاخص", "الشاخص"]),
        (2, ["الخط", "الخطوط", "الرمز", "الرموز", "الضوء الأحمر", "الضوء الأخضر", "الضوء الأصفر"]),
    ],
    "rules": [
        (5, ["الأولوية", "أولوية", "التجاوز", "تجاوز", "الوقوف", "وقوف", "الانتظار", "مخالفة",
             "المخالفة", "غرامة", "الغرامة", "الرخصة", "رخصة", "الترخيص", "التقاطع", "تقاطع",
             "الدوار", "دوار", "السرعة", "سرعة", "الحمولة", "حمولة", "المسرب", "مسرب",
             "الغماز", "الانعطاف", "الالتفاف", "نقاط", "العمومي", "الحد الأقصى", "الأفضلية"]),
        (2, ["القانون", "النظام", "التعليمات", "المادة", "يحظر", "الصلاحية"]),
    ],
}


def classify(text: str) -> str:
    """Each tier contributes `weight * matched words`, but a tier is capped at two
    words so a pile-up of broad vocabulary cannot outvote one precise keyword."""
    scores = {topic: 0 for topic in TOPIC_KEYWORDS}
    for topic, tiers in TOPIC_KEYWORDS.items():
        for weight, words in tiers:
            hits = sum(1 for word in words if word in text)
            scores[topic] += weight * min(hits, 2)
    best = max(scores.values())
    if best == 0:
        return "rules"
    # Deterministic tie-break by a fixed priority, most specific first.
    for topic in ("safety", "vehicle", "signs", "rules"):
        if scores[topic] == best:
            return topic
    return "rules"


def ts(value: str) -> str:
    """Emit a TS single-quoted string literal."""
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"


GROUP_PREFIXES = [("class-4-5-6-part", "heavy"), ("moto-part", "moto"), ("part", "class3")]


def label_for(model: str) -> tuple[str, str]:
    """-> (group, arabic label)"""
    for prefix, group in GROUP_PREFIXES:
        if model.startswith(prefix):
            n = int(model.removeprefix(prefix))
            return group, f"الفحص {ORDINALS[n - 1]}"
    raise ValueError(f"unrecognised model id: {model}")


def main() -> None:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    raw, models = data["questions"], data["models"]

    questions = []
    for i, q in enumerate(raw):
        kept = [a for a in q["answers"] if a["answer"]]
        correct = [j for j, a in enumerate(kept) if a["right"]]
        if len(kept) < 2 or len(correct) != 1:
            continue
        questions.append(
            {
                "old": i,
                "id": BASE_ID + len(questions),
                "topic": classify(q["question"] + " " + " ".join(a["answer"] for a in kept)),
                "text": q["question"],
                "options": [a["answer"] for a in kept],
                "answer": correct[0],
                "image": q["image"],
            }
        )

    remap = {q["old"]: q["id"] for q in questions}

    lines = [
        "/**",
        " * GENERATED FILE — do not edit by hand.",
        " *",
        " * The Jordanian theory-test bank used by the practice exams, mirroring the",
        " * numbered 60-question models that the licensing syllabus is taught from.",
        " * Sign and scenario artwork is referenced at its original URL rather than",
        " * copied into the repo.",
        " *",
        " * Regenerate with:",
        " *   python3 scripts/scrape-questions.py && python3 scripts/build-questions.py",
        " */",
        "import { Question } from './question.model';",
        "",
        "export interface ExamModel {",
        "  id: string;",
        "  label: string;",
        "  group: 'class3' | 'heavy' | 'moto';",
        "  /** Ids into `EXAM_BANK`, in the order the reference exam asks them. */",
        "  questionIds: number[];",
        "}",
        "",
        "export const EXAM_BANK: Question[] = [",
    ]

    for q in questions:
        lines.append("  {")
        lines.append(f"    id: {q['id']},")
        lines.append(f"    topic: {ts(q['topic'])},")
        lines.append(f"    text: {ts(q['text'])},")
        lines.append("    options: [" + ", ".join(ts(o) for o in q["options"]) + "],")
        lines.append(f"    answer: {q['answer']},")
        if q["image"]:
            lines.append(f"    image: {ts(q['image'])},")
        lines.append("  },")

    lines += ["];", "", "export const EXAM_MODELS: ExamModel[] = ["]

    def sort_key(name: str) -> tuple[int, int]:
        group, _ = label_for(name)
        digits = re.sub(r"\D", "", name)
        return ({"class3": 0, "heavy": 1, "moto": 2}[group], int(digits))

    for name in sorted(models, key=sort_key):
        group, label = label_for(name)
        ids = [remap[i] for i in models[name] if i in remap]
        # Preserve exam order while dropping the few repeats within a page.
        ids = list(dict.fromkeys(ids))
        lines.append("  {")
        lines.append(f"    id: {ts(name)},")
        lines.append(f"    label: {ts(label)},")
        lines.append(f"    group: {ts(group)},")
        lines.append(f"    questionIds: [{', '.join(str(i) for i in ids)}],")
        lines.append("  },")

    lines += ["];", ""]

    OUT.write_text("\n".join(lines), encoding="utf-8")

    topics: dict[str, int] = {}
    for q in questions:
        topics[q["topic"]] = topics.get(q["topic"], 0) + 1
    print(f"{len(questions)} questions -> {OUT}")
    print(f"topics: {topics}")
    print(f"with image: {sum(1 for q in questions if q['image'])}")
    print(f"models: {len(models)}")


if __name__ == "__main__":
    main()
