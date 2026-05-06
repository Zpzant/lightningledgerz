"""
Build a 4-panel cities banner with Lightning Ledgerz branding.

Output: marketing/cities-banner.png  (1584 x 396, LinkedIn-cover sized)
        marketing/ll-icon-white.png  (the white LL icon used in the banner)

Run:
    py scripts/make-cities-banner.py

By default it expects 4 source photos saved in marketing/photos/:
    01-nyc.jpg
    02-sarasota.jpg
    03-vegas.jpg
    04-florida.jpg

(Any 4 jpg/png files of any size will work — script crops + resizes.)

Where to grab free, commercial-OK photos:
    https://www.pexels.com  ->  search: "new york city skyline" / "sarasota
    beach" / "las vegas strip" / "florida coast" -> click photo -> Free
    Download -> Original size -> save into marketing/photos/ with the
    exact filenames above.
"""
from PIL import Image, ImageEnhance, ImageOps
import os
import sys

PROJECT      = r"C:\Users\zpzan\OneDrive\Desktop\lightningledgerz"
ICON_SOURCE  = os.path.join(PROJECT, "Googlepicledgerz.png")
PHOTOS_DIR   = os.path.join(PROJECT, "marketing", "photos")
OUT_DIR      = os.path.join(PROJECT, "marketing")
OUT_BANNER   = os.path.join(OUT_DIR, "cities-banner.png")
OUT_ICON     = os.path.join(OUT_DIR, "ll-icon-white.png")

# Banner geometry
BANNER_W, BANNER_H = 1584, 396           # LinkedIn cover
PANEL_W            = BANNER_W // 4       # 396 each
PANELS             = ["01-nyc.jpg", "02-sarasota.jpg", "03-vegas.jpg", "04-florida.jpg"]

# Blue overlay tint colour + opacity (matches the reference look)
TINT_RGB     = (28, 60, 130)
TINT_ALPHA   = 70                        # 0-255

# Icon styling
ICON_TARGET_HEIGHT = 110
ICON_PADDING       = 28                  # distance from bottom-right corner

def ensure_dirs():
    os.makedirs(PHOTOS_DIR, exist_ok=True)
    os.makedirs(OUT_DIR,    exist_ok=True)

def make_white_icon():
    """Recolour the LL icon to pure white, preserving alpha."""
    src = Image.open(ICON_SOURCE).convert("RGBA")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    px_in  = src.load()
    px_out = out.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = px_in[x, y]
            if a > 0:
                px_out[x, y] = (255, 255, 255, a)
    out.save(OUT_ICON, optimize=True)
    print(f"  saved {OUT_ICON}")
    return out

def cover_crop(img, target_w, target_h):
    """Crop+resize like CSS object-fit: cover (no distortion)."""
    src_ratio = img.width / img.height
    tgt_ratio = target_w / target_h
    if src_ratio > tgt_ratio:
        # source is wider → crop sides
        new_w = int(img.height * tgt_ratio)
        left  = (img.width - new_w) // 2
        img = img.crop((left, 0, left + new_w, img.height))
    else:
        # source is taller → crop top/bottom
        new_h = int(img.width / tgt_ratio)
        top   = (img.height - new_h) // 2
        img = img.crop((0, top, img.width, top + new_h))
    return img.resize((target_w, target_h), Image.LANCZOS)

def tint_panel(panel):
    """Apply the brand-blue overlay so all 4 panels feel cohesive."""
    overlay = Image.new("RGBA", panel.size, (*TINT_RGB, TINT_ALPHA))
    return Image.alpha_composite(panel.convert("RGBA"), overlay)

def vignette(panel, strength=0.45):
    """Soft right-edge gradient on each panel so the joins read smoother."""
    w, h = panel.size
    grad = Image.new("L", (w, h), 0)
    px = grad.load()
    for x in range(w):
        # subtle darken on the very right edge of each panel
        v = int(255 * max(0, (x - w * 0.85) / (w * 0.15)) * strength)
        for y in range(h):
            px[x, y] = v
    dark = Image.new("RGBA", (w, h), (5, 8, 30, 255))
    dark.putalpha(grad)
    return Image.alpha_composite(panel.convert("RGBA"), dark)

def build_banner():
    canvas = Image.new("RGBA", (BANNER_W, BANNER_H), (15, 30, 70, 255))
    missing = []
    for i, name in enumerate(PANELS):
        path = os.path.join(PHOTOS_DIR, name)
        if not os.path.exists(path):
            missing.append(name)
            continue
        photo = Image.open(path).convert("RGBA")
        panel = cover_crop(photo, PANEL_W, BANNER_H)
        # boost colour a touch for the marketing pop
        panel = ImageEnhance.Color(panel).enhance(1.1)
        panel = tint_panel(panel)
        if i < len(PANELS) - 1:
            panel = vignette(panel)
        canvas.paste(panel, (i * PANEL_W, 0))
        print(f"  placed panel {i+1}: {name}")
    if missing:
        print(f"\n[!] Missing photos: {', '.join(missing)}")
        print(f"    Save them into {PHOTOS_DIR} and re-run.")
    return canvas

def stamp_icon(canvas, white_icon):
    target_h = ICON_TARGET_HEIGHT
    aspect   = white_icon.width / white_icon.height
    target_w = int(target_h * aspect)
    icon     = white_icon.resize((target_w, target_h), Image.LANCZOS)
    x = BANNER_W - target_w - ICON_PADDING
    y = BANNER_H - target_h - ICON_PADDING
    # Subtle drop shadow so the icon reads on bright photo regions too
    shadow = Image.new("RGBA", icon.size, (0, 0, 0, 0))
    sh_px = shadow.load()
    ic_px = icon.load()
    for yy in range(icon.height):
        for xx in range(icon.width):
            a = ic_px[xx, yy][3]
            if a > 0:
                sh_px[xx, yy] = (0, 0, 0, int(a * 0.5))
    canvas.paste(shadow, (x + 3, y + 3), shadow)
    canvas.paste(icon,   (x,     y    ), icon)
    print(f"  stamped icon at bottom-right ({target_w}x{target_h})")
    return canvas

def main():
    ensure_dirs()
    if not os.path.exists(ICON_SOURCE):
        print(f"Missing source icon: {ICON_SOURCE}", file=sys.stderr)
        sys.exit(1)
    print("Generating white LL icon:")
    white_icon = make_white_icon()
    print("\nComposing banner:")
    canvas = build_banner()
    canvas = stamp_icon(canvas, white_icon)
    canvas.convert("RGB").save(OUT_BANNER, "PNG", optimize=True)
    print(f"\nDone. Banner saved to:\n  {OUT_BANNER}")

if __name__ == "__main__":
    main()
