"""
Build Adpal promo PowerPoint with morph-animated mouse cursor.

Morph transition works by matching shapes with the same name across slides.
The cursor shape is named '!!cursor' on every slide — PowerPoint morphs it
between positions, creating a smooth mouse movement effect.

Slide sequence:
  1. Dashboard
  2. Campaigns list  (cursor moves to Campagnes nav)
  3. Campaign overview (cursor moves to row)
  4. Campaign overview zoomed (cursor hovers chart)
  5. Campaign settings (cursor clicks tab)
  6. New campaign wizard (cursor clicks product)
  7. Campaigns list again (loop)
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.oxml.ns import qn
from lxml import etree
import copy
import os

# Paths
BASE = "/home/user/claude/adpal_pptx"
SS = os.path.join(BASE, "screenshots")
CURSOR_NORMAL = os.path.join(BASE, "cursor_normal.png")
CURSOR_CLICK  = os.path.join(BASE, "cursor_click.png")
OUT = os.path.join(BASE, "adpal_webwinkelvakdagen.pptx")

# Slide dimensions: 16:9 1920×1080 (in EMU)
W = Inches(13.33)
H = Inches(7.5)

CURSOR_SIZE = Inches(0.55)  # cursor width/height on slide

def set_morph_transition(slide, duration_ms=1200):
    """Apply Morph transition to a slide."""
    spTree = slide.shapes._spTree
    # Remove existing transition
    for t in slide._element.findall(qn('p:transition')):
        slide._element.remove(t)

    transition_xml = f"""
    <p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
                  spd="med" dur="{duration_ms}" advTm="3000">
      <p:morph origin="object"/>
    </p:transition>
    """
    trans_el = etree.fromstring(transition_xml.strip())
    slide._element.append(trans_el)


def add_bg_image(slide, img_path):
    """Add full-slide background screenshot."""
    pic = slide.shapes.add_picture(img_path, 0, 0, W, H)
    # Send to back
    sp_tree = slide.shapes._spTree
    sp_tree.remove(pic._element)
    sp_tree.insert(2, pic._element)
    return pic


def add_cursor(slide, cx_frac, cy_frac, cursor_img=CURSOR_NORMAL, name="!!cursor"):
    """
    Add cursor image at fractional position (0.0–1.0 of slide).
    Named '!!cursor' so PowerPoint morph matches it across slides.
    """
    cx = int(cx_frac * W)
    cy = int(cy_frac * H)
    pic = slide.shapes.add_picture(
        cursor_img,
        cx, cy,
        CURSOR_SIZE, CURSOR_SIZE
    )
    pic.name = name
    return pic


def add_highlight_box(slide, x_frac, y_frac, w_frac, h_frac, name="!!highlight"):
    """Add a semi-transparent blue highlight rectangle."""
    from pptx.util import Emu
    x = int(x_frac * W)
    y = int(y_frac * H)
    w = int(w_frac * W)
    h = int(h_frac * H)
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        x, y, w, h
    )
    shape.name = name
    fill = shape.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(0x1d, 0x35, 0x57)
    shape.fill.fore_color.theme_color = None
    # Set transparency via XML
    solidFill = shape.fill._xPr.find(qn('a:solidFill'))
    srgbClr = solidFill.find(qn('a:srgbClr'))
    if srgbClr is None:
        srgbClr = solidFill.find(qn('a:sysClr'))
    alpha_el = etree.SubElement(srgbClr, qn('a:alpha'))
    alpha_el.set('val', '15000')  # 15% opacity

    line = shape.line
    line.color.rgb = RGBColor(0x1d, 0x35, 0x57)
    line.width = Pt(1.5)
    shape.line.fill.fore_color.theme_color = None
    return shape


def make_slides():
    prs = Presentation()
    prs.slide_width  = W
    prs.slide_height = H

    blank_layout = prs.slide_layouts[6]  # Blank

    # ── Slide sequence: (screenshot, cursor_x, cursor_y, cursor_img, title_overlay)
    # Cursor positions are fractions of slide width/height
    slides_data = [
        # 1. Dashboard – cursor in top-left area
        {
            "img": f"{SS}/slide4_dashboard.png",
            "cursor": (0.22, 0.08),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1500,
            "auto_advance_ms": 4000,
        },
        # 2. Campaigns list – cursor moved to nav "Campagnes"
        {
            "img": f"{SS}/slide1_campaigns_list.png",
            "cursor": (0.28, 0.04),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1200,
            "auto_advance_ms": 4000,
        },
        # 3. Campaign overview – cursor hovers first row
        {
            "img": f"{SS}/slide2_campaign_overview.png",
            "cursor": (0.35, 0.38),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1200,
            "auto_advance_ms": 4000,
        },
        # 4. Campaign overview – cursor moves to chart tabs
        {
            "img": f"{SS}/slide2_campaign_overview.png",
            "cursor": (0.52, 0.62),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1000,
            "auto_advance_ms": 3500,
        },
        # 5. Campaign overview – cursor clicks "Impressions & CTR"
        {
            "img": f"{SS}/slide2_campaign_overview.png",
            "cursor": (0.52, 0.62),
            "cursor_img": CURSOR_CLICK,
            "transition_ms": 600,
            "auto_advance_ms": 2500,
        },
        # 6. Campaign settings – cursor on settings tab
        {
            "img": f"{SS}/slide3_campaign_settings.png",
            "cursor": (0.31, 0.28),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1200,
            "auto_advance_ms": 4000,
        },
        # 7. Campaign settings – cursor clicks Opslaan
        {
            "img": f"{SS}/slide3_campaign_settings.png",
            "cursor": (0.82, 0.88),
            "cursor_img": CURSOR_CLICK,
            "transition_ms": 700,
            "auto_advance_ms": 2500,
        },
        # 8. New campaign wizard
        {
            "img": f"{SS}/slide5_new_campaign.png",
            "cursor": (0.22, 0.52),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1300,
            "auto_advance_ms": 4000,
        },
        # 9. New campaign – click product
        {
            "img": f"{SS}/slide5_new_campaign.png",
            "cursor": (0.22, 0.52),
            "cursor_img": CURSOR_CLICK,
            "transition_ms": 600,
            "auto_advance_ms": 2000,
        },
        # 10. Back to campaigns list to loop
        {
            "img": f"{SS}/slide1_campaigns_list.png",
            "cursor": (0.50, 0.50),
            "cursor_img": CURSOR_NORMAL,
            "transition_ms": 1500,
            "auto_advance_ms": 3000,
        },
    ]

    for i, data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_layout)

        # Background screenshot
        add_bg_image(slide, data["img"])

        # Cursor
        add_cursor(slide, data["cursor"][0], data["cursor"][1], data["cursor_img"])

        # Morph transition + auto advance
        set_morph_transition_full(slide, data["transition_ms"], data["auto_advance_ms"])

        print(f"  Slide {i+1} done")

    prs.save(OUT)
    print(f"\n✅ Saved: {OUT}")


def set_morph_transition_full(slide, duration_ms=1200, advance_ms=4000):
    """Morph transition with auto-advance timing."""
    # Remove existing transition
    for t in slide._element.findall(qn('p:transition')):
        slide._element.remove(t)

    ns = "http://schemas.openxmlformats.org/presentationml/2006/main"
    transition_xml = f'<p:transition xmlns:p="{ns}" spd="med" dur="{duration_ms}" advTm="{advance_ms}"><p:morph origin="object"/></p:transition>'
    trans_el = etree.fromstring(transition_xml)
    slide._element.append(trans_el)


if __name__ == "__main__":
    make_slides()
