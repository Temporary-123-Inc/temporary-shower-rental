"""Generate the shower-only 1200 x 630 social preview."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "shower-social-card.png"
FONT = Path("C:/Windows/Fonts/arial.ttf")
BOLD = Path("C:/Windows/Fonts/arialbd.ttf")

image = Image.new("RGB", (1200, 630), "#142f3c")
draw = ImageDraw.Draw(image)
draw.rectangle((0, 0, 18, 630), fill="#f5c451")
draw.rectangle((850, 0, 1200, 630), fill="#087c9a")
draw.rounded_rectangle((912, 130, 1138, 320), radius=32, outline="white", width=12)
draw.arc((965, 155, 1080, 255), 180, 360, fill="white", width=14)
for x in (978, 1012, 1046, 1080):
    draw.line((x, 276, x - 14, 332), fill="#d5f0f5", width=10)

draw.text((72, 57), "TEMPORARY SHOWER RENTAL 123", font=ImageFont.truetype(BOLD, 27), fill="#f5c451")
draw.text((72, 149), "Commercial shower", font=ImageFont.truetype(BOLD, 70), fill="white")
draw.text((72, 236), "trailer rentals", font=ImageFont.truetype(BOLD, 70), fill="white")
draw.text((72, 366), "Nationwide shower service areas", font=ImageFont.truetype(FONT, 34), fill="#d5f0f5")
draw.line((72, 475, 774, 475), fill="#47717d", width=3)
draw.text((72, 515), "1-866-455-7214", font=ImageFont.truetype(BOLD, 36), fill="#f5c451")
image.save(OUT, optimize=True)
print(OUT)
