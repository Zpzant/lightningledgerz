"""
Generate Lightning Ledgerz brand assets for Google / social previews.

Outputs (all to project root):
  - favicon-{16,32,48,64,96,128,144,192,512}x{}.png
                              (dark-navy chip with red icon on top — pops on
                               Google's white search card, iOS rounded tile, etc.)
  - apple-touch-icon.png      (180x180 iOS touch icon, same chip)
  - favicon.png / favicon.ico (default + multi-res ICO)
  - og-image.png              (1200x630 social card, white bg, black-text word-mark)

Source: crops the icon portion from LightningLedgerzLogo.png using alpha-channel
detection so the crop auto-adjusts if the source art changes.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import sys

PROJECT = r"C:\Users\zpzan\OneDrive\Desktop\lightningledgerz"
SOURCE_LOGO = os.path.join(PROJECT, "LightningLedgerzLogo.png")

# Alpha threshold — pixels above this count as "part of the icon"
ALPHA_THRESHOLD = 30
# How many near-empty rows in a row count as a gap between icon and text
GAP_ROW_THRESHOLD = 8
# Ratio of opaque pixels in a row that marks it as "content"
OPAQUE_ROW_FRAC = 0.02
# Padding (as fraction of icon bbox) to leave around the cropped icon when
# centering into the square canvas. 0 = skin-tight; 0.03 = 3% breathing room.
CANVAS_PADDING_FRAC = 0.03

# Favicon chip styling — dark navy rounded square that makes the red icon
# pop against Google's white result card. Matches site brand (#0d1424).
CHIP_BG_COLOR         = (13, 20, 36, 255)   # navy
CHIP_CORNER_RADIUS_FRAC = 0.18              # 18% rounded corners (iOS-tile look)
CHIP_ICON_FILL_FRAC     = 0.72              # icon takes 72% of chip width

def detect_icon_bounds(src):
    """
    Scan the source logo row-by-row from the top. Find the FIRST region of
    opaque rows, terminate at the first big gap (transparent strip between
    icon and word-mark text). Returns a bbox for just the icon.
    """
    w, h = src.size
    alpha = src.split()[3]
    px = alpha.load()

    def row_has_content(y):
        opaque = 0
        for x in range(w):
            if px[x, y] > ALPHA_THRESHOLD:
                opaque += 1
        return opaque / w >= OPAQUE_ROW_FRAC

    # Skip any transparent top-padding rows
    y_start = 0
    while y_start < h and not row_has_content(y_start):
        y_start += 1

    # Walk down while we have content or gaps smaller than threshold
    consecutive_empty = 0
    y_end = y_start
    for y in range(y_start, h):
        if row_has_content(y):
            y_end = y
            consecutive_empty = 0
        else:
            consecutive_empty += 1
            if consecutive_empty >= GAP_ROW_THRESHOLD:
                break

    # Horizontal bounds: use getbbox on just the icon slice
    slice_ = src.crop((0, y_start, w, y_end + 1))
    sbbox = slice_.getbbox() or (0, 0, slice_.width, slice_.height)
    x0 = sbbox[0]
    x1 = sbbox[2]
    print(f"Detected icon region: y={y_start}..{y_end}, x={x0}..{x1}")
    return (x0, y_start, x1, y_end + 1)

def load_and_crop_icon():
    src = Image.open(SOURCE_LOGO).convert("RGBA")
    w, h = src.size
    print(f"Source: {w}x{h}")

    bbox = detect_icon_bounds(src)
    icon = src.crop(bbox)

    # Square-pad with a tiny breathing-room margin
    m = max(icon.size)
    pad = int(m * CANVAS_PADDING_FRAC)
    canvas_size = m + pad * 2
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    canvas.paste(
        icon,
        ((canvas_size - icon.width) // 2, (canvas_size - icon.height) // 2),
        icon,
    )
    print(f"Icon (squared, padded): {canvas.size}")
    return canvas

def rounded_square(size, radius, fill):
    """Make a rounded-square RGBA image that can be used as the chip background."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=fill)
    return img

def chip_favicon(icon, size):
    """
    Compose a favicon chip: dark-navy rounded square with the red icon
    centered on top. Icon is scaled to CHIP_ICON_FILL_FRAC of the chip.
    """
    radius = int(size * CHIP_CORNER_RADIUS_FRAC)
    chip = rounded_square(size, radius, CHIP_BG_COLOR)

    icon_target = int(size * CHIP_ICON_FILL_FRAC)
    icon_resized = icon.resize((icon_target, icon_target), Image.LANCZOS)
    offset = (size - icon_target) // 2
    chip.paste(icon_resized, (offset, offset), icon_resized)
    return chip

def save_favicons(icon):
    # Google favicon guidance: prefers multiples of 48 (48, 96, 144, 192).
    # Include 16/32/64 for legacy support; 512 for PWA manifest.
    sizes = [16, 32, 48, 64, 96, 128, 144, 192, 512]
    for s in sizes:
        chip_favicon(icon, s).save(
            os.path.join(PROJECT, f"favicon-{s}x{s}.png"),
            optimize=True,
        )
        print(f"  favicon-{s}x{s}.png")
    # Apple touch icon (180) — iOS composites this on the home screen
    # and applies its own rounding, but the chip still reads clearly.
    chip_favicon(icon, 180).save(
        os.path.join(PROJECT, "apple-touch-icon.png"), optimize=True
    )
    print("  apple-touch-icon.png")
    # Default favicon.png (32, chip)
    chip_favicon(icon, 32).save(
        os.path.join(PROJECT, "favicon.png"), optimize=True
    )
    print("  favicon.png")
    # ICO with multiple embedded sizes — chip variants
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = [chip_favicon(icon, s[0]) for s in ico_sizes]
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
