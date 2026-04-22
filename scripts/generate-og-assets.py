"""
Generate Lightning Ledgerz brand assets for Google / social previews.

Outputs (all to project root):
  - favicon-{16,32,48,64,128,192,512}x{}.png  (icon-only, clean at small sizes)
  - apple-touch-icon.png                      (180x180 iOS touch icon)
  - favicon.png / favicon.ico                 (default + multi-res ICO)
  - og-image.png                              (1200x630 social card, black-text variant)

Source: crops the icon portion from LightningLedgerzLogo.png. Assumes the
icon occupies the top ~46% of the source image — adjust ICON_FRAC if the
source art changes.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

PROJECT = r"C:\Users\zpzan\OneDrive\Desktop\lightningledgerz"
SOURCE_LOGO = os.path.join(PROJECT, "LightningLedgerzLogo.png")
ICON_FRAC = 0.46    # fraction of source height that is the icon region

def load_and_crop_icon():
    src = Image.open(SOURCE_LOGO).convert("RGBA")
    w, h = src.size
    print(f"Source: {w}x{h}")
    # Crop a square region from the top where the icon lives
    region_h = int(h * ICON_FRAC)
    sq = min(region_h, w)
    left = (w - sq) // 2
    icon = src.crop((left, 0, left + sq, sq))
    # Trim transparent padding
    bbox = icon.getbbox()
    if bbox:
        icon = icon.crop(bbox)
    # Re-square-pad so the icon is centered in a square canvas (prevents stretching on resize)
    m = max(icon.size)
    canvas = Image.new("RGBA", (m, m), (0, 0, 0, 0))
    canvas.paste(icon, ((m - icon.width) // 2, (m - icon.height) // 2), icon)
    print(f"Icon (squared): {canvas.size}")
    return canvas

def save_favicons(icon):
    sizes = [16, 32, 48, 64, 128, 192, 512]
    for s in sizes:
        resized = icon.resize((s, s), Image.LANCZOS)
        resized.save(os.path.join(PROJECT, f"favicon-{s}x{s}.png"), optimize=True)
        print(f"  favicon-{s}x{s}.png")
    # Apple touch icon (180)
    icon.resize((180, 180), Image.LANCZOS).save(
        os.path.join(PROJECT, "apple-touch-icon.png"), optimize=True
    )
    print("  apple-touch-icon.png")
    # Default favicon.png (32)
    icon.resize((32, 32), Image.LANCZOS).save(
        os.path.join(PROJECT, "favicon.png"), optimize=True
    )
    print("  favicon.png")
    # ICO with multiple embedded sizes
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = [icon.resize(s, Image.LANCZOS) for s in ico_sizes]
    ico_images[0].save(
        os.path.join(PROJECT, "favicon.ico"),
        format="ICO",
        sizes=ico_sizes,
    )
    print("  favicon.ico")

def pick_font(size):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/ARIALBD.TTF",
        "C:/Windows/Fonts/Arial Bold.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def text_width(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0]

def save_og_image(icon):
    W, H = 1200, 630
    og = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    # Icon on the left — sized so the right column can hold both word-mark and tagline
    icon_target = 380
    icon_for_og = icon.resize((icon_target, icon_target), Image.LANCZOS)
    ix = 50
    iy = (H - icon_target) // 2
    og.paste(icon_for_og, (ix, iy), icon_for_og)

    draw = ImageDraw.Draw(og)
    # Word-mark font-size sized so "LIGHTNING" fits inside the remaining width
    font_big  = pick_font(110)
    font_tag  = pick_font(44)

    text_x = ix + icon_target + 40
    text_right_limit = W - 50   # 50px right margin

    # Auto-shrink word-mark font if "LIGHTNING" overflows
    for size in (110, 104, 98, 92, 86):
        font_big = pick_font(size)
        if text_x + text_width(draw, "LIGHTNINGX", font_big) <= text_right_limit:
            break

    # Auto-shrink tagline if the full BUDGET · BOOKKEEP · BUILD overflows
    sep = "  ·  "
    tag_parts_for_measure = ["BUDGET", sep, "BOOKKEEP", sep, "BUILD"]
    for size in (44, 42, 40, 38, 36, 34, 32):
        font_tag = pick_font(size)
        total = sum(text_width(draw, p, font_tag) for p in tag_parts_for_measure)
        if text_x + total <= text_right_limit:
            break

    # Center text vertically around icon
    big_h = font_big.size
    tag_h = font_tag.size
    block_h = big_h * 2 + int(big_h * 0.15) + int(tag_h * 1.4)
    y_start = (H - block_h) // 2

    # LIGHTNING (black)
    lightning_y = y_start
    draw.text((text_x, lightning_y), "LIGHTNING", fill="#0a0a0a", font=font_big)

    # LEDGER (black) + Z (red)
    ledger_y = lightning_y + big_h + int(big_h * 0.15)
    draw.text((text_x, ledger_y), "LEDGER", fill="#0a0a0a", font=font_big)
    lw = text_width(draw, "LEDGER", font_big)
    draw.text((text_x + lw, ledger_y), "Z", fill="#e8231a", font=font_big)

    # Tagline: BUDGET  ·  BOOKKEEP  ·  BUILD  (BOOKKEEP in red)
    tag_y = ledger_y + big_h + int(tag_h * 0.55)
    parts = [("BUDGET", "#0a0a0a"), (sep, "#0a0a0a"),
             ("BOOKKEEP", "#e8231a"), (sep, "#0a0a0a"),
             ("BUILD", "#0a0a0a")]
    cur_x = text_x
    for txt, color in parts:
        draw.text((cur_x, tag_y), txt, fill=color, font=font_tag)
        cur_x += text_width(draw, txt, font_tag)

    og.convert("RGB").save(
        os.path.join(PROJECT, "og-image.png"),
        "PNG",
        optimize=True,
    )
    print(f"  og-image.png ({W}x{H}) — word-mark {font_big.size}pt, tagline {font_tag.size}pt")

def main():
    if not os.path.exists(SOURCE_LOGO):
        print(f"Missing source logo: {SOURCE_LOGO}", file=sys.stderr)
        sys.exit(1)
    icon = load_and_crop_icon()
    print("\nSaving favicons:")
    save_favicons(icon)
    print("\nSaving OG image:")
    save_og_image(icon)
    print("\nAll assets generated.")

if __name__ == "__main__":
    main()
