"""Generate a realistic mouse cursor PNG with shadow."""
from PIL import Image, ImageDraw
import math

SIZE = 64

def make_cursor(path, highlight=False):
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Shadow
    shadow_pts = [(6, 6), (6, 44), (16, 34), (22, 48), (26, 46), (20, 32), (34, 32)]
    shadow_img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow_img)
    sd.polygon(shadow_pts, fill=(0, 0, 0, 60))
    # Blur shadow manually by shifting
    for dx, dy in [(1,1),(2,2),(3,3),(2,1),(1,2)]:
        shifted = [(x+dx, y+dy) for x,y in shadow_pts]
        sd.polygon(shifted, fill=(0,0,0,20))
    img.alpha_composite(shadow_img)

    # Cursor body (white fill)
    cursor_pts = [(4, 4), (4, 42), (14, 32), (20, 46), (24, 44), (18, 30), (32, 30)]
    draw.polygon(cursor_pts, fill=(255, 255, 255, 255))

    # Cursor outline (dark)
    draw.polygon(cursor_pts, outline=(30, 30, 30, 255))

    # Highlight glow if clicking
    if highlight:
        glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse([0, 0, 28, 28], fill=(255, 220, 0, 80))
        img.alpha_composite(glow)

    img.save(path)
    print(f"Cursor saved: {path}")

make_cursor("/home/user/claude/adpal_pptx/cursor_normal.png", highlight=False)
make_cursor("/home/user/claude/adpal_pptx/cursor_click.png", highlight=True)
