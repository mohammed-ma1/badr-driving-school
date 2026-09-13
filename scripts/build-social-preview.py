#!/usr/bin/env python3
"""Build the WhatsApp/Open Graph image from the centre's real photograph."""

from pathlib import Path

import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "coach-badr-car.jpg"
OUTPUT = ROOT / "public" / "social-preview.jpg"

W, H = 1200, 630
ORANGE = "#f97316"
WHITE = "#ffffff"
MUTED = "#d6d3d1"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "Arial Bold.ttf" if bold else "Arial.ttf"
    return ImageFont.truetype(f"/System/Library/Fonts/Supplemental/{name}", size)


def ar(text: str) -> str:
    """Shape and reorder Arabic for Pillow builds compiled without libraqm."""
    return get_display(arabic_reshaper.reshape(text))


canvas = Image.new("RGB", (W, H), "#0f1115")

# Keep the source photograph intact: square it with a small crop, upscale it,
# and place it on the right rather than asking a generator to recreate Badr.
photo = Image.open(SOURCE).convert("RGB")
side = min(photo.size)
photo = photo.crop((0, 0, side, side)).resize((630, 630), Image.Resampling.LANCZOS)
canvas.paste(photo, (W - 630, 0))

# Blend the photograph into the dark information panel.
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px = overlay.load()
for x in range(W):
    alpha = 0
    if x >= 500:
        alpha = max(0, int(215 * (1 - (x - 500) / 420)))
    for y in range(H):
        px[x, y] = (15, 17, 21, alpha)
canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay)

draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle((64, 70, 238, 108), radius=19, fill=ORANGE)
draw.text((218, 78), ar("تدريب معتمد"), font=font(20, True), fill=WHITE, anchor="ra")

draw.text(
    (520, 165),
    ar("المدرب بدر الجبور"),
    font=font(46, True),
    fill=WHITE,
    anchor="ra",
)
draw.text(
    (520, 230),
    ar("لتعليم قيادة السيارات"),
    font=font(39, True),
    fill=ORANGE,
    anchor="ra",
)

draw.text(
    (520, 322),
    ar("تدريب جميع فئات القيادة"),
    font=font(26),
    fill=MUTED,
    anchor="ra",
)
draw.text(
    (520, 365),
    ar("وفحص نظري تجريبي مجاني"),
    font=font(26),
    fill=MUTED,
    anchor="ra",
)

draw.line((64, 447, 520, 447), fill="#3f3f46", width=2)
draw.text((520, 485), "077 208 3839", font=font(31, True), fill=WHITE, anchor="ra")
draw.text(
    (520, 535),
    ar("عمّان، الأردن"),
    font=font(22),
    fill=MUTED,
    anchor="ra",
)

canvas.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)
print(OUTPUT)
